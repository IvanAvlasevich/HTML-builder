const path = require('path')
const fs = require('fs')
const fs_promises = require('node:fs/promises');

const dirPath = path.join(__dirname,'files')
const newDir = path.join(__dirname,'files-copy')

async function makeDirectory() {
  const projectFolder = path.join(__dirname, 'files-copy');

      fs.readdir(projectFolder,(error, filesDir) => {
        if (!error) {
          filesDir.forEach((file) => {
            let delPath = path.join(projectFolder,file)
            fs.unlink(delPath,(err)=>{
              if (err){console.error(err)}
            })
            })
          }
        })
  
  const dirCreation = await fs_promises.mkdir(projectFolder, { recursive: true });
  return dirCreation;
}

makeDirectory()
  .then(  fs.readdir(dirPath,{withFileTypes: true},(error, files)=>{

    files.forEach((file)=>{
      if (!(file.isDirectory())){
        let dirPathOne = path.join(dirPath,file.name)
        let newDirOne = path.join(newDir,file.name)
        const readStream = fs.createReadStream((dirPathOne))
        const writeStream = fs.createWriteStream((newDirOne))

        readStream.on('data',(chunk) => {
          writeStream.write(chunk)
        })
      }
    })
  }))

  .catch(console.error);

