import * as fs from 'node:fs';

let readStream = fs.createReadStream('01-read-file\\text.txt', 'utf8');

readStream.on('data', (chunk)=>{
  console.log(chunk);
});


