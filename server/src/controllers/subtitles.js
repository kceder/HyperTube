import { saveSub } from "../lib/subUtils.js"

async function getSubtitles(req, res) {
  // Destructure the query
  const { id: imdbId } = req.params
  const { language } = req.query
  const baseUrl = 'https://api.opensubtitles.com/api/v1/'
  let englishSubsFileId // temporary (eventually we want to iterate over allFileIds)
  const englishSubsArr = []
  const otherSubsArr = []
  const allSubsFileIds = []               // The file ids of the subs we want.
  const allSubs = []                      // The URLs to the subtitle files.
  const imdbIdNumeric = Number(imdbId.replace(/\D/g, ''))
  let subsLink
  let subs

  try {
    const response = await fetch(
      baseUrl +
        'subtitles?' +
        new URLSearchParams({
          imdb_id: imdbIdNumeric,
        }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Api-Key': 'XxvT3Wc5zytDqrWssllOVaKNwPWKccNn',
        },
      },
    )
    const { data: subsArr } = await response.json()
    
    /* Here is where we get the array of subtitles. So we gotta filter them
      and extract:
      1. English subtitles (required no matter what)
      2. Only if the user has set a language other than English on the UI,
      we add subtitles for that language (probably a good idea to add Spanish
      to the UI since it's the language, other than English,  with more chances
      of having available subtitles). */
    englishSubsArr.push(...subsArr.filter(s => {
      return s.attributes.language === 'en'
    }))

    let language = 'es' // <=== TESTING!!!
    if (language !== 'en') {
      otherSubsArr.push(...subsArr.filter(s => {
        return s.attributes.language === language
      }))
    }
    allSubs.push(englishSubsArr[0])
    allSubs.push(otherSubsArr[0])
    allSubsFileIds.push(...allSubs.map(s => s.attributes.files[0].file_id))

    englishSubsFileId = allSubsFileIds[0] // temporary!!!

    subs = subsArr
    console.log(
      `Subtitles - file_id: ${englishSubsFileId} is a ${typeof englishSubsFileId}`,
    )
  } catch (error) {
    console.log(error)
  }

  try {
    const response = await fetch(baseUrl + 'download', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': 'XxvT3Wc5zytDqrWssllOVaKNwPWKccNn',
      },
      body: JSON.stringify({
        file_id: englishSubsFileId,
        sub_format: 'webvtt',
      })
    })

    console.log('Subtitles - response:', response)

    if (response.ok) {
      const data = await response.json()
      console.log('Subtitles - file:', data.link)

      // Take the download link from the response
      subsLink = data.link
      const pathToSub = await saveSub(subsLink, imdbId, language)
      console.log('pathToSub',pathToSub)
      return res.status(200).json({
        subtitles: [pathToSub],
        allSubs: allSubs,
        allSubsFileIds: allSubsFileIds,
      })
    } else {
      return res.status(401).json({ subtitles: 'nope' })
    }
  } catch (error) {
    console.log(error)
    return res.status(401).json({ subtitles: 'error' })
  }
}

export { getSubtitles }
