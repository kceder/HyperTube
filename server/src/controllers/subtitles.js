import { saveSub } from "../lib/subUtils.js"

async function getSubtitles(req, res) {
  // Destructure the query
  const { id: imdbId } = req.params
  const { language } = req.query
  const baseUrl = 'https://api.opensubtitles.com/api/v1/'
  let englishSubsId
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
    englishSubsId = subsArr[0].attributes.files[0].file_id
    // console.log(`Subtitles for ${imdbIdNumeric}: ${JSON.stringify(subsArr)}`)
    subs = subsArr
    console.log(
      `Subtitles - file_id: ${englishSubsId} is a ${typeof englishSubsId}`,
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
        file_id: englishSubsId,
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
      return res.status(200).json({ subtitles: [pathToSub] })
    } else {
      return res.status(401).json({ subtitles: 'nope' })
    }
  } catch (error) {
    console.log(error)
    return res.status(401).json({ subtitles: 'error' })
  }
}

export { getSubtitles }
