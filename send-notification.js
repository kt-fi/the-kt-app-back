import admin from 'firebase-admin';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const serviceAccountPath = process.env.SERVICE_ACCOUNT_PATH || './server/service-account.json';
import { readFileSync } from 'fs';
const serviceAccount = JSON.parse(readFileSync(path.resolve(serviceAccountPath), 'utf-8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Send to single token
export async function sendToToken(token, title, body = '', data = {}) {
  const message = {
    token,
    notification: { title, body },
    data: Object.entries(data).reduce((acc, [k, v]) => ({ ...acc, [k]: String(v) }), {}),
    android: {
      priority: 'high',
      notification: { channelId: 'default' }
    },
    apns: {
      payload: { aps: { 'content-available': 1 } }
    }
  };

  try {
    const resp = await admin.messaging().send(message);
    console.log('Sent message id:', resp);
    return resp;
  } catch (err) {
    console.error('Error sending message:', err);
    throw err;
  }
}