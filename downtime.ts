import { App } from '@slack/bolt';
import { log, logError } from './logger';

export function downtimeNotifyer(channelID: string, slackApp: App, message: string = "Oh nose! The bot is DOWN. What shall you ever do?!?") {
    slackApp.client.chat.postMessage({
        channel: channelID,
        text: "Downtime notifier is awaiting downtime!"
    });

    const alertInterval = 60 * 2 + 10; // Time between messages (in seconds)
    let index = 0;

    log("Function starting...");

    // Interval set to run every (alertInterval - 60) to cancel the message at least 60 seconds before it's sent
    const cancelInterval = (alertInterval - 65) * 1000; // Run cancellation 60 seconds before message posts

    setInterval(async () => {
        try {
            // Get list of scheduled messages for the channel and cancel them
            const scheduledMessages = (await slackApp.client.chat.scheduledMessages.list())

            if (scheduledMessages.ok) {
                //@ts-ignore
                for (const scheduledMessage of scheduledMessages.scheduled_messages) {
                    log("Canceling scheduled message with ID: " + scheduledMessage.id);
                    const result = await slackApp.client.chat.deleteScheduledMessage({
                        channel: channelID,
                        //@ts-ignore
                        scheduled_message_id: scheduledMessage.id
                    });
                    log("Message canceled: " + JSON.stringify(result));
                }
            }

            // Schedule new message to be posted after alertInterval
            const unixTime = Math.floor(Date.now() / 1000);
            const response = await slackApp.client.chat.scheduleMessage({
                channel: channelID,
                text: message + " #" + index,
                post_at: unixTime + alertInterval
            });

            log("Scheduled new message with ID: " + response.scheduled_message_id);
            index += 1;
        } catch (error) {
            logError("Downtime notifier issue!", error);
        }
    }, cancelInterval); // Run this interval before the message is within 60 seconds of being sent
}