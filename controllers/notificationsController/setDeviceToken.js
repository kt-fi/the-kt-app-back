import DeviceToken from '../../schemas/deviceTokenSchema.js';


const setDeviceToken = async (req, res, next) => {
      try {
            const { deviceToken, userId, platform } = req.body;
            if (!userId || !deviceToken || !platform) {
                  return res.status(400).json({ message: 'userId, deviceToken, and platform are required.' });
            }

            // Find if a device token already exists for this user and platform
            let tokenDoc = await DeviceToken.findOne({ userId, platform });
            if (!tokenDoc) {
                  // Create new device token
                  tokenDoc = new DeviceToken({ userId, token: deviceToken, platform });
                  await tokenDoc.save();
                  return res.status(201).json({ message: 'Device token created.', token: tokenDoc });
            } else {
                  // Update existing device token
                  tokenDoc.token = deviceToken;
                  await tokenDoc.save();
                  return res.status(200).json({ message: 'Device token updated.', token: tokenDoc });
            }
      } catch (error) {
            console.error('Error in setDeviceToken:', error);
            res.status(500).json({ message: 'Internal server error.' });
      }
};

export default setDeviceToken;