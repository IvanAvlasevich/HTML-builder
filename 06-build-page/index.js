const path = require('path')
const fs = require('fs')
const fs_promises = require('node:fs/promises');

const projectDist = path.join(__dirname,'project-dist');
const assetsDir = path.join(__dirname,'assets');
const componentsDir = path.join(__dirname,'components');
const stylesDir = path.join(__dirname,'styles');
const dirIndexHtml = path.join(projectDist,'index.html');
const dirStyleCss = path.join(projectDist,'style.css');
const dirCloneAssets = path.join(projectDist,'assets')

async function createDirectory () {

    async function deletefiles (from){
      await fs.readdir(from,{withFileTypes: true},(error, filesDir) => { //перезапись 
        // if (error){console.error(error)}
          if(filesDir === undefined){return}
          filesDir.forEach((file) => {
            //console.log('file',file.name)
            if (file.isFile()) {
              let delPath = path.join(from,file.name)
              fs.unlink(delPath,(err)=>{
              if (err){console.error(err)}
              })
              }
            if (file.isDirectory()){
              let fromDir = path.join(from,file.name)
              deletefiles(fromDir)
            }
            })
          }) 
    }
    deletefiles (projectDist)
  

  const dirCreation = await fs_promises.mkdir(projectDist,{ recursive: true })
  return dirCreation;
}

createDirectory()
  .then( //создали index.html и переписали в него из template.html
    fs.readdir(projectDist,()=>{
      const dirTemplate = path.join(__dirname,'template.html');
      const readStream = fs.createReadStream((dirTemplate))
      const writeStream = fs.createWriteStream((dirIndexHtml))
      readStream.on('data',(chunk) => {
        writeStream.write(chunk)
      })
    })
  )
  .then( //читаем папку с html файлами,получаем массив их названий, содержимого
         // делаем замену в index.html на файлы articles, footer, header
    fs.readdir(componentsDir,(err,htmlFiles)=>{
      if(err){console.error(err)}
        let htmlFilesObj = [];
      htmlFiles.forEach(files => {
        fs.readFile(componentsDir+'/'+files,'utf-8',(err,data)=>{
          if(err){console.error(err)}
          let obj = new Object();
          obj.fileName = files;
          obj.item = data;
          obj.tagName = '{{'+ files.split('.')[0] +'}}'
          htmlFilesObj.push(obj)
          if(htmlFilesObj.length === htmlFiles.length){
            fs.readFile(dirIndexHtml,'utf-8',(err,data)=>{
              let dataHtml = data;
              if(err){console.error(err)}
              for(let i = 0; i<htmlFilesObj.length;i++){
                if(dataHtml.includes(htmlFilesObj[i].tagName)){
                  dataHtml = dataHtml.replace((htmlFilesObj[i].tagName),(htmlFilesObj[i].item));
                }
              }
              fs.writeFile(dirIndexHtml, dataHtml, (err) => {
                if(err) throw err;
                //console.log('index.html файлы заменены');
            });
        
            })
          }
        }) 
      })
    })
  )
  
  .then( //
    fs.readdir(stylesDir,{withFileTypes: true},(error, styleFiles)=>{
      if(error){console.error(error)}
      //console.log('stylesDir',styleFiles)
      let writeStream = fs.createWriteStream(dirStyleCss);
      styleFiles.forEach((file)=>{
        let style = path.join(stylesDir,file.name)
        let readStream = fs.createReadStream(style)
        readStream.on('data',(chunk)=>{
          writeStream.write(chunk)
        })
      })
      
    })
  )
  .then(
    fs.mkdir(dirCloneAssets,{recursive:true},(err)=>{
      if (err){console.error(err)}
      //console.log('dir assets created')

      async function copyAssets(from=assetsDir,to=dirCloneAssets){
        await fs.promises
        .readdir(from,{withFileTypes: true},(error, files)=>{
        // console.log(files)
        })
        .then(files => {
          files.forEach(async (file) => {
            //console.log('assets file',file.name)
            if (file.isDirectory()){
              const fromPath = path.join(from, file.name)
              const toPath = path.join(to, file.name)
              copyAssets(fromPath, toPath)
              }else {
                fs.mkdir(to, {recursive: true}, (err) => {
                  if (err) {
                      throw new Error('Folder already exists or it maybe another problem with it');
                  }
              })
                fs.promises.copyFile(path.join(from, file.name), path.join(to, file.name))
            }
          })
        })
      }
      copyAssets(assetsDir, dirCloneAssets)
    })

  )
  .catch(console.error);