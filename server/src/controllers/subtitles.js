import https from 'https';
import fs from 'fs';

async function getSubtitles(req, res) {
  // Destructure the quer

  const { id } = req.params
  const { language } = req.query
  const baseUrl = 'https://api.opensubtitles.com/api/v1/'
  let englishSubsId
  const imdbIdNumeric = Number(id.replace(/\D/g, ''))
  let subs

  try {
    const response = await fetch(baseUrl + 'subtitles?' + new URLSearchParams({
      imdb_id: imdbIdNumeric
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': 'XxvT3Wc5zytDqrWssllOVaKNwPWKccNn'
      }
    })
    const { data: subsArr } = await response.json()
    englishSubsId = subsArr[0].attributes.files[0].file_id
    // console.log(`Subtitles for ${imdbIdNumeric}: ${JSON.stringify(subsArr)}`)
    subs = subsArr
    console.log(`Subtitles - file_id: ${englishSubsId} is a ${typeof englishSubsId}`)
  } catch (error) {
    console.log(error)
  }

  try {
    const response = await fetch(baseUrl + 'download', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': 'XxvT3Wc5zytDqrWssllOVaKNwPWKccNn'
      },
      body: JSON.stringify({
        'file_id': englishSubsId
      })
    })

    console.log('Subtitles - response:', response);

    if (response.ok) {
      const data = await response.json()
      console.log('Subtitles - file:', data.link)

      // Take the download link from the response
      const subsLink = data.link
      try {
        if (!fs.existsSync(`./public/subtitles/${id}`)) {
          fs.mkdirSync(`./public/subtitles/${id}`)
        }
        const file = fs.createWriteStream(`./public/subtitles/${id}/${language}.srt`)
        https.get(subsLink, function (response) {
          response.pipe(file)
        })
      } catch (error) {
        console.log(error)
      }

      return res.status(200).json({ subtitles: 'ok' })

    } else {
      // return res.status(401).json({ subtitles: 'nope' }) 
    }
  } catch (error) {
    console.log(error)
    return res.status(401).json({ subtitles: 'error' })
  }
  res.status(200).json({
    englishSubsId: englishSubsId,
    subtitles: subs,
  })
}

export { getSubtitles }