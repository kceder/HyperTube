import fs from 'fs/promises'
import path from 'path'

/**
 *  This function does two things:
 *
 * 1. Writes to the filesystem the image file received as argument.
 * 2. Writes to the Database the URL of the image file above.
 * 
 *   - Args:
 *        - pic: Image file (created by 'formidable' in /temp folder)
 *        - uid: So we can build the absolute path to the user's Uploads folder.
 *   - Returns:
 *        - The URL (relative path) of the pic in the user's folder.
 */
export const savePic = async (pic, uid) => {
  /* It seems the current directory './' is taken relative to the project's 
  root. So './public' would be under 'projectRoot/public', whereas '__dirname'
  is relative to the folder where the original call was made, as if the code
  was within the '/app/.next/server' folder. */
  const userFolder = path.join(`/app/public/uploads/${uid}`)
  // const userFolder = path.join(`${__dirname}/../../../public/uploads/${uid}`)

  // Check if the user images folder exists
  var folderExists
  try {
    await fs.access(userFolder)
    folderExists = true
    // console.log(`folderExists? ${folderExists}`) // testing
  } catch (error) {
    folderExists = false
    // console.log(`This script is at ${__dirname}`) // testing
    // console.log(`It seems ${userFolder} doesn't exist! (${error})`) // testing
  }

  if (!folderExists) {
    try {
      await fs.mkdir(userFolder, { recursive: true })
      // console.log(`Creating ${userFolder}`) // testing
    } catch (error) {
      // console.log(`Error creating ${userFolder} (${error})`) // testing
    }
  }

  // Read the first pic (the server placed it in a /temp folder)
  const content = await fs.readFile(pic.filepath, (err) => {
    if (err) console.log(err)
  })

  // Extract the extension from 'image/png', 'image/jpeg', etc
  const ext = pic.mimetype.split('/')[1]

  // Write the pic to the user's folder
  await fs.writeFile(`${userFolder}/${pic.newFilename}.${ext}`, content)

  // We return the relative URL, in case we want to send it in the response.
  return `/uploads/${uid}/${pic.newFilename}.${ext}`
}
