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
    console.log('Starting enhanced cron job with per-user tracking...')
    
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

    // 3. Process each event and find users who haven't been notified yet
    const eventsToProcess = []
    for (const eventItem of upcomingEvents) {
      const eventId = eventItem.id ?? `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      if (!eventId) {
        console.warn('Event missing ID:', eventItem.title)
        continue
      }

      // Get users who haven't received this notification yet
      const usersToNotify = await notificationTracker.getUsersNotNotified(eventId)
      
      if (usersToNotify.length > 0) {
        eventsToProcess.push({ 
          ...eventItem, 
          eventId,
          usersToNotify,
          totalUsersToNotify: usersToNotify.length,
          totalTokensToSend: usersToNotify.reduce((sum, user) => sum + user.tokens.length, 0)
        })
        console.log(`Event "${eventItem.title}": ${usersToNotify.length} users (${usersToNotify.reduce((sum, user) => sum + user.tokens.length, 0)} tokens) need notification`)
      } else {
        // Get existing stats for this event
        const eventStats = await notificationTracker.getEventNotificationStats(eventId)
        console.log(`Event "${eventItem.title}": All eligible users already notified (${eventStats?.usersWithSuccessfulDelivery || 0} users)`)
      }
    }

    if (eventsToProcess.length === 0) {
      return { 
        message: 'All eligible users have already been notified for upcoming events',
        totalUpcomingEvents: upcomingEvents.length,
        stats
      }
    }

    // 4. Send notifications with per-user tracking
    const results = []
    let totalNewNotifications = 0
    let totalNewUsers = 0

    for (const eventToProcess of eventsToProcess) {
      try {
        console.log(`Processing notifications for: ${eventToProcess.title}`)
        
        // Send notifications to users who haven't received them yet
        const result = await notificationTracker.sendEventNotificationWithTracking(
          eventToProcess, 
          eventToProcess.usersToNotify
        )
        
        // Update tracking with detailed delivery information
        await notificationTracker.updateEventNotificationTracking(
          eventToProcess.eventId,
          eventToProcess,
          result.deliveries,
          eventToProcess.usersToNotify
        )

        totalNewNotifications += result.successCount
        totalNewUsers += eventToProcess.usersToNotify.length

        // Get updated event statistics
        const eventStats = await notificationTracker.getEventNotificationStats(eventToProcess.eventId)

        results.push({
          event: eventToProcess.title,
          eventId: eventToProcess.eventId,
          newNotifications: {
            usersTargeted: eventToProcess.usersToNotify.length,
            tokensTargeted: eventToProcess.totalTokensToSend,
            successCount: result.successCount,
            failureCount: result.failureCount,
            invalidTokenCount: result.invalidTokens.length,
            deliveryRate: eventToProcess.totalTokensToSend > 0 ? 
              ((result.successCount / eventToProcess.totalTokensToSend) * 100).toFixed(1) + '%' : '0%'
          },
          overallStats: eventStats
        })

        console.log(`Completed notifications for: ${eventToProcess.title} (${result.successCount}/${eventToProcess.totalTokensToSend} successful)`)
      } catch (error) {
        console.error(`Failed to send notifications for ${eventToProcess.title}:`, error)
        results.push({
          event: eventToProcess.title,
          eventId: eventToProcess.eventId,
          error: error
        })
      }
    }

    const summary = {
      message: 'Enhanced notifications processed with per-user tracking',
      eventsProcessed: eventsToProcess.length,
      totalUpcomingEvents: upcomingEvents.length,
      newNotificationsSent: totalNewNotifications,
      newUsersNotified: totalNewUsers,
      stats,
      results
    }

    console.log('Enhanced cron job completed:', summary)
    return summary

  } catch (error) {
    console.error('Enhanced cron job error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: `Internal server error: ${error}`
    })
  }
})