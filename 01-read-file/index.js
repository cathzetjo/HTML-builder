import * as fs from 'node:fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const absolutePath = path.join(__dirname, 'text.txt');
let readStream = fs.createReadStream(absolutePath, 'utf8');

readStream.on('data', (chunk)=>{
  console.log(chunk);
});


