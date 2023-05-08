import * as fs from 'node:fs';
import path from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const absolutePath = path.join(__dirname, 'secret-folder');

fs.readdir(absolutePath, {withFileTypes: true}, (error, files) => {
  if (error) throw error;
  files.forEach(file => {
    if (file.isFile()) {
      const name = file.name.split('.')[0];
      const filePath = path.join(absolutePath, file.name);
      let ext = (path.extname(filePath)).replace('.','');
      if (!ext) {
        ext = 'no file extension';
      }
      fs.stat(filePath, (error, stats) => {
        if (error) throw error;
        else {
          const size = `${stats.size/1000}kb`;
          console.log(`${name} - ${ext} - ${size}`);
        }
      });
    }
  });
});