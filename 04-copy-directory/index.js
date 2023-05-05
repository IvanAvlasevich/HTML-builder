
const path = require('path')
const fs = require('fs')

const dirPath = path.join(__dirname,'files')
const newDir = path.join(__dirname,'files-copy')

const fs_promises = require('node:fs/promises');

async function makeDirectory() {
  const projectFolder = path.join(__dirname, 'files-copy');
  const dirCreation = await fs_promises.mkdir(projectFolder, { recursive: true });

  if(dirCreation === undefined){
    console.log('Папка уже была создана');
  }else {
    console.log('Создание копии папки...');

  }
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

