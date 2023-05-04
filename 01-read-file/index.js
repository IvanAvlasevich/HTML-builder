const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname,'text.txt');
const readFile = fs.createReadStream(filePath);
readFile.on('data',(chunk) => {
  console.log(chunk.toString())
})