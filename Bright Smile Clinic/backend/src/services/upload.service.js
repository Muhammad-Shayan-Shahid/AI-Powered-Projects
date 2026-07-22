const ImageKit = require('imagekit');
const { IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, IMAGEKIT_URL_ENDPOINT } = require('../config/config');

const imagekit = new ImageKit({
  publicKey: IMAGEKIT_PUBLIC_KEY,
  privateKey: IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: IMAGEKIT_URL_ENDPOINT,
});

// Shared by doctor profile photos and knowledge-base document files — both
// just need "give me bytes + a name, get back a public URL." useUniqueFileName
// means callers don't have to worry about collisions between uploads.
async function uploadToImageKit({ buffer, fileName, folder }) {
  const result = await imagekit.upload({
    file: buffer,
    fileName,
    folder,
    useUniqueFileName: true,
  });
  return result.url;
}

module.exports = { uploadToImageKit };
