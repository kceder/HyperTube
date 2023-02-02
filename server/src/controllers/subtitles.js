import { downloadSub } from '../lib/subUtils.js'

async function getSubtitles(req, res) {
  // Destructure the query
  const { id: imdbId } = req.params
  const { language } = req.query
  console.log('languafe', language)
  const baseUrl = 'https://api.opensubtitles.com/api/v1/'
  const englishSubsArr = []
  const otherSubsArr = []
  const allSubsFileObjs = [] // The file ids of the subs we want.
  const allSubsMapped = [] // The URLs to the subtitle files.
  const subs = [] // The URLs to the subtitle files.
  const imdbIdNumeric = Number(imdbId.replace(/\D/g, ''))

  // Check that the subtitles don't already exist in the DB.
  let subsArr
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
    const { data } = await response.json()
    subsArr = data
    /* Here is where we get the array of subtitles. So we gotta filter them
      and extract:
      1. English subtitles (required no matter what)
      2. Only if the user has set a language other than English on the UI,
      we add subtitles for that language (probably a good idea to add Spanish
      to the UI since it's the language, other than English,  with more chances
      of having available subtitles). */
    englishSubsArr.push(
      ...subsArr.filter((s) => {
        return s.attributes.language === 'en'
      }),
    )

    allSubsFileObjs.push(englishSubsArr[0]) // grab just the 1st one

    if (language !== 'en') {
      otherSubsArr.push(
        ...subsArr.filter((s) => {
          imdbId, language
          return s.attributes.language === language
        }),
      )
      allSubsFileObjs.push(otherSubsArr[0]) // grab just the 1st one
    }

    allSubsMapped.push(
      ...allSubsFileObjs.map((s) => ({
        file_id: s.attributes.files[0].file_id,
        srcLang: s.attributes.language,
      })),
    )
  } catch (error) {
    console.log(error)
  }

  try {
    for (const obj of allSubsMapped) {
      let { url, srcLang } = await downloadSub(
        obj.file_id,
        baseUrl,
        imdbId,
        obj.srcLang,
      )

      subs.push({
        src: url,
        srcLang: srcLang,
        label: obj.label,
      })
    }

    return res.status(200).json({
      allSubs: subsArr,
      subtitles: subs, // the good stuff
    })
  } catch (error) {
    console.log(error)
    return res.status(401).json({ subtitles: 'error' })
  }
}

export { getSubtitles }
