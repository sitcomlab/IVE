const fs = require('fs-extra')
const { join, dirname } = require('path')

const PATHS = {
  videos:         join(__dirname, '../public/videos'),
  video_overlays: join(__dirname, '../public/videos/overlays'),
  video_thumbs:   join(__dirname, '../public/thumbnails'),
  objects:        join(__dirname, '../public/objects'),
  images:         join(__dirname, '../public/images'),
}

function storeFileMiddleware (objectType, finalize) {
  if (!PATHS[objectType])
    throw new Error(`invalid store type ${objectType}. Possible values: ${Object.keys(PATHS)}`)

  return async function (req, res, next) {
    const tmpfile = req.files.file.path
    const filename = req.params.folderUrl 
      ? join(req.params.folderUrl, req.files.file.name)
      : req.files.file.name
    const filepath = join(PATHS[objectType], filename)

    try {
      await fs.ensureDir(dirname(filepath))
      await fs.move(tmpfile, filepath)
      if (finalize) return res.sendStatus(200)
      else next()
    } catch (err) {
      if (finalize) return res.sendStatus(500)
      else next(err)
    }
  }
}

module.exports = {
  PATHS,
  storeFileMiddleware,
}
