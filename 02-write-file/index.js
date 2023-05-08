import * as fs from 'node:fs';
import process from 'node:process';
import path from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const absolutePath = path.join(__dirname, 'text.txt');

fs.appendFile(absolutePath, '', function (error) {
  if (error) throw error;
});

let writeStream = fs.createWriteStream(absolutePath, 'utf8');

process.stdout.write('Write your text and press ENTER button:\n');

process.stdin.on('data', data => {
  const input = data.toString();
  if (input.toLowerCase().trim() === 'exit') {
    exit();
  }
  process.on('SIGINT', () => {
    exit();
  });
  writeStream.write(input);
});

function exit() {
  console.log('Bye bye, Amigo!');
  process.exit();
}



