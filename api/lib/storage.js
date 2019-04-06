// Imports the Google Cloud client library
const { Storage } = require('@google-cloud/storage')

async function createImage(bucketName = 'sns-images', file, fileName) {
  // Creates a client
  const storage = new Storage()

  // Creates the new bucket
  await storage.bucket(bucketName).upload(file, {
    gzip: true,
    destination: 'postImages/' + fileName,
    metadata: {
      // Enable long-lived HTTP caching headers
      // Use only if the contents of the file will never change
      // (If the contents will change, use cacheControl: 'no-cache')
      cacheControl: 'public, max-age=31536000'
    }
  })
  console.log(`Upload to ${bucketName} successed.`)
}

createImage()
