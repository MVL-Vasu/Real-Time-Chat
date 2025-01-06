// const cloudinary = require('./cloudinaryConfig');
// const streamifier = require('streamifier');

// const upload = (file) => {

//      console.log('Uploading');

//      return new Promise((resolve, reject) => {

//           let stream = cloudinary.uploader.upload_stream(
//                {
//                     folder: "files",
//                     transformation: [
//                          { width: 800, height: 800, crop: "limit" }
//                     ]
//                },
//                (error, result) => {

//                     if (error) {

//                          return reject(error);

//                     } else {

//                          return resolve(result);

//                     }

//                })

//           streamifier.createReadStream(file.buffer).pipe(stream)

//      })

// }

// module.exports = upload;

const cloudinary = require('./cloudinaryConfig');
const streamifier = require('streamifier');

const upload = (file) => {
     return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
               {
                    folder: 'Profile_image',
                    transformation: [{ width: 800, height: 800, crop: 'limit' }],
               },
               (error, result) => {
                    if (error) {
                         return reject(error);
                    }
                    resolve(result);
               }
          );

          streamifier.createReadStream(file.buffer).pipe(stream);
     });
};

module.exports = upload;

