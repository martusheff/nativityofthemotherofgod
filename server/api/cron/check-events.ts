// server/api/cron/check-events.ts
import { notificationTracker } from '../../utils/firebaseAdmin'

export default defineEventHandler(async (event) => {
  // Verify the request is from Vercel's cron
  const authHeader = getHeader(event, 'authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  try {
    console.log('Starting cron job...')
    
    // Get notification statistics first
    const stats = await notificationTracker.getNotificationStats()
    console.log('Notification stats:', stats)
    
    // 1. Get all events from Nuxt Content
    console.log('Fetching events from content...')
    const events = await queryCollection(event, 'events').all()
    console.log('Events fetched:', events.length)
    
    // 2. Check for events in the next 24 hours (PST)
    const now = new Date()
    const pstNow = new Date(now.toLocaleString("en-US", { timeZone: "America/Los_Angeles" }))
    const next24Hours = new Date(pstNow.getTime() + (24 * 60 * 60 * 1000))
    
    const upcomingEvents = events.filter(event => {
      const eventDate = new Date(event.date)
      const eventPST = new Date(eventDate.toLocaleString("en-US", { timeZone: "America/Los_Angeles" }))
      return eventPST >= pstNow && eventPST <= next24Hours
    })

    if (upcomingEvents.length === 0) {
      return { 
        message: 'No upcoming events in the next 24 hours',
        stats
      }
    }

    console.log(`Found ${upcomingEvents.length} upcoming events`)

    // 3. Filter out events that already had notifications sent
    const eventsToNotify = []
    for (const event of upcomingEvents) {
      const eventId = event.id ?? "12345678"
      if (!eventId) {
        console.warn('Event missing ID:', event.title)
        continue
      }

      // Note: You had "&& false" in your original code, which would always skip notifications
      // I'm removing it, but you can add it back if you want to test without sending notifications
      const alreadySent = await notificationTracker.wasNotificationSent(eventId)
      if (!alreadySent) {
        eventsToNotify.push({ ...event, eventId })
      } else {
        console.log(`Skipping ${event.title} - notification already sent`)
      }
    }

    if (eventsToNotify.length === 0) {
      return { 
        message: 'No new events to send notifications for',
        totalUpcomingEvents: upcomingEvents.length,
        stats
      }
    }

    // 4. Get all users with FCM tokens (now supports multiple devices per user)
    const fcmTokens = await notificationTracker.getUsersWithNotifications()

    if (fcmTokens.length === 0) {
      return { 
        message: 'No users with FCM tokens found',
        eventsToNotify: eventsToNotify.length,
        stats
      }
    }

    console.log(`Found ${fcmTokens.length} FCM tokens across ${stats.usersWithTokens} users`)

    // 5. Send notifications and track them
    const results = []
    let totalSuccessCount = 0
    let totalFailureCount = 0
    let totalInvalidTokens = 0

    for (const event of eventsToNotify) {
      try {
        const result = await notificationTracker.sendEventNotification(event, fcmTokens)
        
        // Mark as sent
        await notificationTracker.markNotificationSent(event.eventId, {
          title: event.title,
          date: event.date,
          notificationCount: result.successCount
        })

        totalSuccessCount += result.successCount
        totalFailureCount += result.failureCount
        totalInvalidTokens += result.invalidTokens.length

        results.push({
          event: event.title,
          eventId: event.eventId,
          successCount: result.successCount,
          failureCount: result.failureCount,
          invalidTokenCount: result.invalidTokens.length
        })

        console.log(`Sent notification for: ${event.title} (${result.successCount} success, ${result.failureCount} failed)`)
      } catch (error) {
        console.error(`Failed to send notification for ${event.title}:`, error)
        results.push({
          event: event.title,
          eventId: event.eventId,
          error: error || 'Unknown error'
        })
      }
    }

    const summary = {
      message: 'Notifications processed',
      eventsProcessed: eventsToNotify.length,
      totalUpcomingEvents: upcomingEvents.length,
      totalTokensTargeted: fcmTokens.length,
      totalSuccessfulNotifications: totalSuccessCount,
      totalFailedNotifications: totalFailureCount,
      totalInvalidTokensRemoved: totalInvalidTokens,
      deliveryRate: fcmTokens.length > 0 ? ((totalSuccessCount / (fcmTokens.length * eventsToNotify.length)) * 100).toFixed(1) + '%' : '0%',
      stats,
      results
    }

    console.log('Cron job completed:', summary)
    return summary

  } catch (error) {
    console.error('Cron job error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: `Internal server error: ${error}`
    })
  }
})