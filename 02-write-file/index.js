
const { stdin, stdout, stderr  } = require('process');
const fs = require('fs');
const path = require('path');

const txtPath = path.join(__dirname,'text.txt');
const writeStream = fs.createWriteStream(txtPath);

stdout.write('Have a good day! Please, enter the text...\n');
stdin.on('data', (data) => {
  if (data.toString() === 'exit\r\n' || data.toString() === 'exit\n'){
    process.exit();
  };
  writeStream.write(data);
});
process.on('exit', code => {
  stdout.write('Good luck, see you!');
  writeStream.close();
  process.exit();
});
process.on('SIGINT', code => {
  stdout.write('Good luck, see you!');
  writeStream.close();
  process.exit();
});