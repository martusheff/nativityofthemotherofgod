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

interface UserTokenMapping {
  userId: string
  tokens: string[]
  deviceIds: string[]
}

interface NotificationDelivery {
  userId: string
  deviceId: string
  fcmToken: string
  status: 'success' | 'failed' | 'invalid_token'
  sentAt: FirebaseFirestore.Timestamp | Date
  error?: string
}

interface EventNotificationTracking {
  eventId: string
  eventTitle: string
  eventDate: string
  createdAt: FirebaseFirestore.Timestamp | Date
  lastUpdated: FirebaseFirestore.Timestamp | Date
  totalUsersTargeted: number
  totalTokensTargeted: number
  deliveries: NotificationDelivery[]
  summary: {
    successCount: number
    failureCount: number
    invalidTokenCount: number
  }
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

// Enhanced notification tracking utilities
export const notificationTracker = {
  /**
   * Get users with their FCM tokens and user IDs for tracking
   */
  async getUsersWithNotificationsDetailed(): Promise<UserTokenMapping[]> {
    try {
      const usersSnapshot = await db.collection('users')
        .where('notifications.enabled', '==', true)
        .get()

      const userMappings: UserTokenMapping[] = []

      usersSnapshot.forEach(doc => {
        const userData = doc.data() as { notifications?: UserNotifications }
        const notifications = userData.notifications

        if (notifications?.tokens) {
          const tokens: string[] = []
          const deviceIds: string[] = []

          Object.entries(notifications.tokens).forEach(([deviceId, tokenData]) => {
            if (tokenData?.fcmToken) {
              tokens.push(tokenData.fcmToken)
              deviceIds.push(deviceId)
            }
          })

          if (tokens.length > 0) {
            userMappings.push({
              userId: doc.id,
              tokens,
              deviceIds
            })
          }
        }
      })

      console.log(`Found ${userMappings.length} users with ${userMappings.reduce((sum, user) => sum + user.tokens.length, 0)} total tokens`)
      return userMappings
    } catch (error) {
      console.error('Error getting users with notifications:', error)
      return []
    }
  },

  /**
   * Get users who haven't received notification for a specific event
   */
  async getUsersNotNotified(eventId: string): Promise<UserTokenMapping[]> {
    try {
      // Get existing notification tracking for this event
      const trackingDoc = await db.collection('notification_tracking').doc(eventId).get()
      const existingTracking = trackingDoc.exists ? trackingDoc.data() as EventNotificationTracking : null

      // Get all users with notifications enabled
      const allUsers = await this.getUsersWithNotificationsDetailed()

      if (!existingTracking) {
        // No one has been notified yet, return all users
        return allUsers
      }

      // Filter out users who have already been successfully notified
      const notifiedUserIds = new Set(
        existingTracking.deliveries
          .filter(delivery => delivery.status === 'success')
          .map(delivery => delivery.userId)
      )

      return allUsers.filter(user => !notifiedUserIds.has(user.userId))
    } catch (error) {
      console.error('Error getting users not notified:', error)
      return []
    }
  },

  /**
   * Send FCM notifications with detailed per-user tracking
   */
  async sendEventNotificationWithTracking(event: any, userMappings: UserTokenMapping[]) {
    try {
      // Prepare notification content
      const eventDateUTC = new Date(event.date)
      const pstTimeZone = 'America/Los_Angeles'
      const eventDatePST = toZonedTime(eventDateUTC, pstTimeZone)

      const now = new Date()
      const pstNow = toZonedTime(now, pstTimeZone)

      const isTomorrow = (
        eventDatePST.getDate() === pstNow.getDate() + 1 &&
        eventDatePST.getMonth() === pstNow.getMonth() &&
        eventDatePST.getFullYear() === pstNow.getFullYear()
      )

      const timeFormatted = format(eventDatePST, 'h:mm a')
      const body = `${event.title} begins ${isTomorrow ? 'tomorrow ' : ''}at ${timeFormatted}`

      // Flatten all tokens with user/device mapping
      const tokenToUserMap: { [token: string]: { userId: string, deviceId: string } } = {}
      const allTokens: string[] = []

      userMappings.forEach(userMapping => {
        userMapping.tokens.forEach((token, index) => {
          tokenToUserMap[token] = {
            userId: userMapping.userId,
            deviceId: userMapping.deviceIds[index]
          }
          allTokens.push(token)
        })
      })

      if (allTokens.length === 0) {
        return {
          successCount: 0,
          failureCount: 0,
          invalidTokens: [],
          deliveries: []
        }
      }

      // Send notifications
      const message = {
        notification: {
          title: 'Church of the Nativity of the Mother of God',
          body: body
        },
        tokens: allTokens
      }

      const response = await messaging.sendEachForMulticast(message)

      // Process results and create delivery records
      const deliveries: NotificationDelivery[] = []
      const invalidTokens: string[] = []

      response.responses.forEach((resp, index) => {
        const token = allTokens[index]
        const userInfo = tokenToUserMap[token]

        if (resp.success) {
          deliveries.push({
            userId: userInfo.userId,
            deviceId: userInfo.deviceId,
            fcmToken: token,
            status: 'success',
            sentAt: new Date()
          })
        } else {
          const error = resp.error
          const isInvalidToken = error?.code === 'messaging/invalid-registration-token' ||
            error?.code === 'messaging/registration-token-not-registered'

          if (isInvalidToken) {
            invalidTokens.push(token)
          }

          deliveries.push({
            userId: userInfo.userId,
            deviceId: userInfo.deviceId,
            fcmToken: token,
            status: isInvalidToken ? 'invalid_token' : 'failed',
            sentAt: new Date(),
            error: error?.message || 'Unknown error'
          })
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
        invalidTokens,
        deliveries
      }

    } catch (error) {
      console.error('Error sending FCM notification:', error)
      throw error
    }
  },

  /**
   * Update notification tracking with detailed delivery information
   */
  async updateEventNotificationTracking(eventId: string, eventData: any, deliveries: NotificationDelivery[], userMappings: UserTokenMapping[]) {
    try {
      const trackingRef = db.collection('notification_tracking').doc(eventId)
      const existingDoc = await trackingRef.get()
      const existingTracking = existingDoc.exists ? existingDoc.data() as EventNotificationTracking : null

      // Merge with existing deliveries
      const allDeliveries = existingTracking ?
        [...existingTracking.deliveries, ...deliveries] :
        deliveries

      // Calculate summary
      const summary = {
        successCount: allDeliveries.filter(d => d.status === 'success').length,
        failureCount: allDeliveries.filter(d => d.status === 'failed').length,
        invalidTokenCount: allDeliveries.filter(d => d.status === 'invalid_token').length
      }

      const trackingData: EventNotificationTracking = {
        eventId,
        eventTitle: eventData.title,
        eventDate: eventData.date,
        createdAt: existingTracking?.createdAt || new Date(),
        lastUpdated: new Date(),
        totalUsersTargeted: userMappings.length,
        totalTokensTargeted: userMappings.reduce((sum, user) => sum + user.tokens.length, 0),
        deliveries: allDeliveries,
        summary
      }

      await trackingRef.set(trackingData)
      console.log(`Updated notification tracking for event ${eventId}: ${summary.successCount} success, ${summary.failureCount} failed, ${summary.invalidTokenCount} invalid`)

    } catch (error) {
      console.error('Error updating notification tracking:', error)
    }
  },

  /**
   * Check if a specific user received notification for an event
   */
  async wasUserNotified(eventId: string, userId: string): Promise<boolean> {
    try {
      const trackingDoc = await db.collection('notification_tracking').doc(eventId).get()
      if (!trackingDoc.exists) return false

      const tracking = trackingDoc.data() as EventNotificationTracking
      return tracking.deliveries.some(delivery =>
        delivery.userId === userId && delivery.status === 'success'
      )
    } catch (error) {
      console.error('Error checking user notification status:', error)
      return false
    }
  },

  /**
   * Get notification statistics for an event
   */
  async getEventNotificationStats(eventId: string) {
    try {
      const trackingDoc = await db.collection('notification_tracking').doc(eventId).get()
      if (!trackingDoc.exists) {
        return null
      }

      const tracking = trackingDoc.data() as EventNotificationTracking

      // Group by user to get unique user statistics
      const userDeliveries = new Map<string, NotificationDelivery[]>()
      tracking.deliveries.forEach(delivery => {
        if (!userDeliveries.has(delivery.userId)) {
          userDeliveries.set(delivery.userId, [])
        }
        userDeliveries.get(delivery.userId)!.push(delivery)
      })

      const usersWithSuccessfulDelivery = Array.from(userDeliveries.values())
        .filter(deliveries => deliveries.some(d => d.status === 'success')).length

      return {
        ...tracking.summary,
        totalUsersTargeted: tracking.totalUsersTargeted,
        totalTokensTargeted: tracking.totalTokensTargeted,
        usersWithSuccessfulDelivery,
        userDeliveryRate: tracking.totalUsersTargeted > 0 ?
          (usersWithSuccessfulDelivery / tracking.totalUsersTargeted * 100).toFixed(1) + '%' : '0%',
        tokenDeliveryRate: tracking.totalTokensTargeted > 0 ?
          (tracking.summary.successCount / tracking.totalTokensTargeted * 100).toFixed(1) + '%' : '0%',
        lastUpdated: tracking.lastUpdated
      }
    } catch (error) {
      console.error('Error getting event notification stats:', error)
      return null
    }
  },

  // Keep existing methods for backward compatibility
  async wasNotificationSent(eventId: string): Promise<boolean> {
    try {
      const doc = await db.collection('notification_tracking').doc(eventId).get()
      return doc.exists
    } catch (error) {
      console.error('Error checking notification status:', error)
      return false
    }
  },

  async getUsersWithNotifications(): Promise<string[]> {
    const userMappings = await this.getUsersWithNotificationsDetailed()
    return userMappings.flatMap(user => user.tokens)
  },

  async sendEventNotification(event: any, fcmTokens: string[]) {
    // This is the legacy method - redirect to the new tracking method
    const userMappings = await this.getUsersWithNotificationsDetailed()
    return this.sendEventNotificationWithTracking(event, userMappings)
  },

  async markNotificationSent(eventId: string, eventData?: any): Promise<void> {
    // Legacy method - now just creates a basic tracking record
    try {
      const trackingRef = db.collection('notification_tracking').doc(eventId)
      const existingDoc = await trackingRef.get()

      if (!existingDoc.exists) {
        await trackingRef.set({
          eventId,
          eventTitle: eventData?.title,
          eventDate: eventData?.date,
          createdAt: new Date(),
          lastUpdated: new Date(),
          totalUsersTargeted: 0,
          totalTokensTargeted: 0,
          deliveries: [],
          summary: {
            successCount: eventData?.notificationCount || 0,
            failureCount: 0,
            invalidTokenCount: 0
          }
        })
      }
    } catch (error) {
      console.error('Error marking notification as sent:', error)
    }
  },

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

          Object.entries(notifications.tokens).forEach(([deviceId, tokenData]) => {
            if (tokenData?.fcmToken && invalidTokens.includes(tokenData.fcmToken)) {
              delete updatedTokens[deviceId]
              hasInvalidTokens = true
              // Removes invalid tokens for device.
            }
          })

          if (hasInvalidTokens) {
            batch.update(doc.ref, {
              'notifications.tokens': updatedTokens,
              'notifications.updatedAt': new Date()
            })
            batchCount++

            if (batchCount >= 450) {
              console.log('Batch limit approaching, committing current batch.')
              return
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