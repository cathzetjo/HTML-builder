import * as fs from 'node:fs';
import path from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const absolutePathStyles = path.join(__dirname, 'styles');
const absolutePathBundle = path.join(__dirname, 'project-dist', 'bundle.css');

fs.createWriteStream(absolutePathBundle);
const stylesExt = '.css';
fs.readdir(absolutePathStyles, {withFileTypes: true}, (error, files) => {
  if (error) throw error;
  files.forEach(file => {
    if (path.extname(file.name) === stylesExt) {
      const readStream = fs.createReadStream(path.join(absolutePathStyles, file.name), 'utf-8');
      readStream.on('data', chunk => {
        fs.appendFile(absolutePathBundle, `${chunk}\n`, error => {
          if (error) throw error;
        });
      });
    }
  });
});