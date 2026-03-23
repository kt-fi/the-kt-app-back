import admin from 'firebase-admin';

// Ensure admin is initialized once in your app. If you have a central init file, import admin from there.
// Example initialization (only if not initialized elsewhere):
// if (!admin.apps.length) {
//   admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
// }

export async function sendToToken(token, title, body = '', data = {}, platform = 'generic') {
  // Convert data values to strings (FCM requires strings)
  const payloadData = data && typeof data === 'object'
    ? Object.fromEntries(Object.entries(data).map(([k, v]) => [k, String(v)]))
    : {};

  const message = {
    token,
    notification: { title, body }
  };

  if (platform === 'web') {
    message.webpush = {
      headers: { Urgency: 'high' },
      notification: {
        title,
        body,
        icon: 'https://your-site.example/icon-192.png'
      }
    };
  } else {
    message.android = { priority: 'high', notification: { channelId: 'default' } };
    message.apns = { payload: { aps: { 'content-available': 1 } } };
  }

  if (Object.keys(payloadData).length) message.data = payloadData;

  const masked = token ? `${token.slice(0,8)}...${token.slice(-6)}` : token;
  console.log('Attempting to send notification to', masked, 'platform=', platform);
  console.log('Server Firebase projectId:', admin.app().options?.projectId);

  try {
    const resp = await admin.messaging().send(message);
    console.log('FCM send success id:', resp);
    return resp;
  } catch (err) {
    console.error('FCM send error', {
      code: err?.code,
      message: err?.message,
      errorInfo: err?.errorInfo ? JSON.stringify(err.errorInfo) : undefined
    });
    throw err;
  }
}