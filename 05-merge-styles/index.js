const path = require('path')
const fs = require('fs')

const dirPathStyle = path.join(__dirname,'styles')
const dirPathBundle = path.join(__dirname,'project-dist/bundle.css')

const writeStream = fs.createWriteStream((dirPathBundle))

fs.readdir(dirPathStyle,{withFileTypes: true},(error, files)=>{
  
  files.forEach((file)=>{
    if (!(file.isDirectory())){
      if(path.extname(file.name) === '.css'){
        let styleFile = path.join(dirPathStyle,file.name)
        const readStream = fs.createReadStream((styleFile))

        readStream.on('data',(chunk) => {
          writeStream.write(chunk.toString() + '\n')
        })
      }
      
    }
  })
})



