import * as fs from 'node:fs';
import path from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const absolutePathBase = path.join(__dirname, 'files');
const absolutePathCopy = path.join(__dirname, 'files-copy');

async function copyFiles(base, copy) {
  await fs.promises.rm(copy, { recursive: true, force: true });
  fs.mkdir(copy, { recursive: true }, (error) => {
    if (error) throw error;
  });
  fs.readdir(base, {withFileTypes: true}, (error, files) => {
    if (error) throw error;
    files.forEach(file => {
      if(file.isFile()) {
        fs.copyFile(path.join(base, file.name), path.join(copy, file.name), error => {
          if (error) throw error;
        });
      }
      if(file.isDirectory()) {
        fs.mkdir(path.join(copy, file.name), { recursive: true }, (error) => {
          if (error) throw error;
        });
        copyFiles(path.join(base, file.name), path.join(copy, file.name));
      }
    });
  });
}

copyFiles(absolutePathBase, absolutePathCopy);