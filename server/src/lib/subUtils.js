import { default as fsPromise } from 'fs/promises'
import fs from 'fs'
import path from 'path'
import https from 'https'

export const saveSub = async (subsLink, imdbId, language) => {
  const subtitleFolder = path.join(`/app/public/subtitles/${imdbId}`)

  let folderExists
  try {
    await fsPromise.access(subtitleFolder)
    folderExists = true
    console.log(`folderExists? ${folderExists}`) // testing
  } catch (error) {
    folderExists = false
    // console.log(`This script is at ${__dirname}`) // testing
    // console.log(`It seems ${userFolder} doesn't exist! (${error})`) // testing
  }

  if (!folderExists) {
    try {
      await fsPromise.mkdir(subtitleFolder, { recursive: true })
      console.log(`Creating ${subtitleFolder}`) // testing
    } catch (error) {
      console.log(`Error creating ${subtitleFolder} (${error})`) // testing
    }
  }

  // Saving the sub file
  try {
    if (!fs.existsSync(`/app/public/subtitles/${imdbId}`)) {
      fs.mkdirSync(`/app/public/subtitles/${imdbId}`)
    }
    const file = fs.createWriteStream(`/app/public/subtitles/${imdbId}/${language}.vtt`)
    https.get(subsLink, function (response) {
      response.pipe(file)
    })
  } catch (error) {
    console.log(error)
  }

  /* We return the URL to the subtitle file, that we want to send in the
  response. Note that it must be RELATIVE to the location of the video file!
  (hence the two dots) */
  return `../subtitles/${imdbId}/${language}.vtt`
}
