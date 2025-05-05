const { v2: cloudinary } = require('cloudinary');
require('dotenv').config()
;
cloudinary.config({ 
    cloud_name: 'daxrovkug', 
    secure: true,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

module.exports = cloudinary;