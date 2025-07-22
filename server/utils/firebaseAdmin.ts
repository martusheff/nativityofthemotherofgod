// server/utils/firebaseAdmin.ts
import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { getMessaging } from 'firebase-admin/messaging'
import { format } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'

// Type definitions
interface TokenData {
  fcmToken: string
  updatedAt: FirebaseFirestore.Timestamp | Date
  userAgent: string
  lastSeen: FirebaseFirestore.Timestamp | Date
}

interface NotificationTokens {
  [deviceId: string]: TokenData
}

interface UserNotifications {
  enabled: boolean
  tokens?: NotificationTokens
  preferences?: any
  updatedAt: FirebaseFirestore.Timestamp | Date
}

interface NotificationStats {
  totalUsers: number
  usersWithTokens: number
  totalDevices: number
  avgDevicesPerUser: string
}

// Initialize Firebase Admin SDK (singleton)
function initializeFirebaseAdmin() {
  if (getApps().length === 0) {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      })
    })
  }
  return {
    db: getFirestore(),
    messaging: getMessaging()
  }
}

export const { db, messaging } = initializeFirebaseAdmin()

// Notification tracking utilities
export const notificationTracker = {
  /**
   * Check if notifications were already sent for this event
   */
  async wasNotificationSent(eventId: string): Promise<boolean> {
    try {
      const doc = await db.collection('notification_tracking').doc(eventId).get()
      return doc.exists
    } catch (error) {
      console.error('Error checking notification status:', error)
      return false
    }
  },

  /**
   * Mark event as having notifications sent
   */
  async markNotificationSent(eventId: string, eventData?: any): Promise<void> {
    try {
      await db.collection('notification_tracking').doc(eventId).set({
        sentAt: new Date(),
        eventTitle: eventData?.title,
        eventDate: eventData?.date,
        notificationCount: eventData?.notificationCount || 0
      })
    } catch (error) {
      console.error('Error marking notification as sent:', error)
    }
  },

  /**
   * Get all users with FCM tokens (updated for multi-device support)
   */
  async getUsersWithNotifications(): Promise<string[]> {
    try {
      const usersSnapshot = await db.collection('users')
        .where('notifications.enabled', '==', true)
        .get()

      const fcmTokens: string[] = []
      const invalidTokens: string[] = []

      usersSnapshot.forEach(doc => {
        const userData = doc.data() as { notifications?: UserNotifications }
        const notifications = userData.notifications

        if (notifications?.tokens) {
          // Extract FCM tokens from all devices
          Object.entries(notifications.tokens).forEach(([deviceId, tokenData]) => {
            if (tokenData?.fcmToken) {
              fcmTokens.push(tokenData.fcmToken)
            }
          })
        }
      })

      console.log(`Found ${fcmTokens.length} FCM tokens from ${usersSnapshot.size} users`)
      return fcmTokens
    } catch (error) {
      console.error('Error getting users with notifications:', error)
      return []
    }
  },

  /**
   * Clean up invalid FCM tokens from user documents
   */
  async cleanupInvalidTokens(invalidTokens: string[]): Promise<void> {
    if (invalidTokens.length === 0) return

    try {
      console.log(`Cleaning up ${invalidTokens.length} invalid tokens`)
      
      const usersSnapshot = await db.collection('users')
        .where('notifications.enabled', '==', true)
        .get()

      const batch = db.batch()
      let batchCount = 0

      usersSnapshot.forEach(doc => {
        const userData = doc.data() as { notifications?: UserNotifications }
        const notifications = userData.notifications

        if (notifications?.tokens) {
          let hasInvalidTokens = false
          const updatedTokens: NotificationTokens = { ...notifications.tokens }

          // Remove devices with invalid tokens
          Object.entries(notifications.tokens).forEach(([deviceId, tokenData]) => {
            if (tokenData?.fcmToken && invalidTokens.includes(tokenData.fcmToken)) {
              delete updatedTokens[deviceId]
              hasInvalidTokens = true
              console.log(`Removing invalid token for device ${deviceId} from user ${doc.id}`)
            }
          })

          if (hasInvalidTokens) {
            batch.update(doc.ref, {
              'notifications.tokens': updatedTokens,
              'notifications.updatedAt': new Date()
            })
            batchCount++

            // Firestore batch limit is 500 operations
            if (batchCount >= 450) {
              console.log('Batch limit approaching, committing current batch')
              return // We'll handle this in chunks if needed
            }
          }
        }
      })

      if (batchCount > 0) {
        await batch.commit()
        console.log(`Successfully cleaned up invalid tokens from ${batchCount} user documents`)
      }
    } catch (error) {
      console.error('Error cleaning up invalid tokens:', error)
    }
  },

  /**
   * Send FCM notifications for an event (updated for multi-device support)
   */
  async sendEventNotification(event: any, fcmTokens: string[]) {
    try {
      // Use event.date in PST
      const eventDateUTC = new Date(event.date)
      const pstTimeZone = 'America/Los_Angeles'
      const eventDatePST = toZonedTime(eventDateUTC, pstTimeZone)

      const now = new Date()
      const pstNow = toZonedTime(now, pstTimeZone)

      // Check if the event is "tomorrow" in PST
      const isTomorrow = (
        eventDatePST.getDate() === pstNow.getDate() + 1 &&
        eventDatePST.getMonth() === pstNow.getMonth() &&
        eventDatePST.getFullYear() === pstNow.getFullYear()
      )

      // Format the time as "hh:mm AM/PM"
      const timeFormatted = format(eventDatePST, 'h:mm a')

      const body = `${event.title} begins ${isTomorrow ? 'tomorrow ' : ''}at ${timeFormatted}`

      const message = {
        notification: {
          title: 'Church of the Nativity of the Mother of God',
          body: body
        },
        tokens: fcmTokens
      }

      const response = await messaging.sendEachForMulticast(message)

      // Handle invalid tokens
      const invalidTokens: string[] = []
      response.responses.forEach((resp, index) => {
        if (!resp.success) {
          const error = resp.error
          if (error?.code === 'messaging/invalid-registration-token' ||
              error?.code === 'messaging/registration-token-not-registered') {
            invalidTokens.push(fcmTokens[index])
          }
        }
      })

      // Clean up invalid tokens asynchronously
      if (invalidTokens.length > 0) {
        this.cleanupInvalidTokens(invalidTokens).catch(error => {
          console.error('Failed to cleanup invalid tokens:', error)
        })
      }

      return {
        successCount: response.successCount,
        failureCount: response.failureCount,
        invalidTokens
      }

    } catch (error) {
      console.error('Error sending FCM notification:', error)
      throw error
    }
  },

  /**
   * Get notification statistics
   */
  async getNotificationStats(): Promise<NotificationStats> {
    try {
      const usersSnapshot = await db.collection('users')
        .where('notifications.enabled', '==', true)
        .get()

      let totalUsers = 0
      let totalDevices = 0
      let usersWithTokens = 0

      usersSnapshot.forEach(doc => {
        const userData = doc.data() as { notifications?: UserNotifications }
        const notifications = userData.notifications

        totalUsers++

        if (notifications?.tokens) {
          const deviceCount = Object.keys(notifications.tokens).length
          if (deviceCount > 0) {
            usersWithTokens++
            totalDevices += deviceCount
          }
        }
      })

      return {
        totalUsers,
        usersWithTokens,
        totalDevices,
        avgDevicesPerUser: usersWithTokens > 0 ? (totalDevices / usersWithTokens).toFixed(2) : '0'
      }
    } catch (error) {
      console.error('Error getting notification stats:', error)
      return {
        totalUsers: 0,
        usersWithTokens: 0,
        totalDevices: 0,
        avgDevicesPerUser: '0'
      }
    }
  }
}