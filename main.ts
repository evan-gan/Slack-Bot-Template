import { App } from '@slack/bolt';
import * as dotenv from 'dotenv';
import { log, logError, logWarn } from './logger';
import {downtimeNotifyer} from './downtime'

dotenv.config();


log("starting...")

// Initializes app with bot token and app token for Socket Mode
const app = new App({
    token: process.env.SLACK_BOT_TOKEN!,
    appToken: process.env.SLACK_APP_TOKEN!,
    signingSecret: process.env.SLACK_SIGNING_SECRET!,
    socketMode: true,
});

async function attemptReconnect() {
    try {
        log('Attempting to reconnect...');
        await app.start();
        log('Reconnected successfully!');
    } catch (error) {
        logError('Reconnection failed:', error);
        setTimeout(attemptReconnect, 5000); // Retry after 5 seconds
    }
}


downtimeNotifyer("U05D1G4H754", app)
