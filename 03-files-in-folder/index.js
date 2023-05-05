const path = require('path')
const fs = require('fs')

const dirPath = path.join(__dirname,'secret-folder')

fs.readdir(dirPath,{withFileTypes: true},(error, files)=>{
  files.forEach((file)=>{
    if (!(file.isDirectory())){
      fs.stat(path.join(dirPath,file.name),(error,stats) =>{
        let arr = file.name.split('.')
        console.log(arr[0],'-',path.extname(file.name),'-',stats.size)
      })

    }
  })
})


