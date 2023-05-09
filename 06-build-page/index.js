import * as fs from 'node:fs';
import path from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const absolutePathProjectDist = path.join(__dirname, 'project-dist');
fs.mkdir(absolutePathProjectDist, {recursive: true}, (error) => {
  showError(error);
});

async function copyDir(base, dist) {
  await fs.promises.rm(dist, {recursive: true, force: true});
  fs.mkdir(dist, {recursive: true}, (error) => {
    showError(error);
  });
  fs.readdir(base, {withFileTypes: true}, (error, elements) => {
    elements.forEach(element => {
      const elementName = element.name;
      if (element.isFile()) {
        fs.copyFile(path.join(base, elementName), path.join(dist, elementName), error => {
          showError(error);
        });
      }
      if (element.isDirectory()) {
        fs.mkdir(path.join(dist, elementName), {recursive: true}, (error) => {
          showError(error);
        });
        copyDir(path.join(base, elementName), path.join(dist, elementName));
      }
    });
  });
}

copyDir(path.join(__dirname, 'assets'), path.join(absolutePathProjectDist, 'assets'));

const absolutePathStylesBase = path.join(__dirname, 'styles');
const absolutePathStylesDist = path.join(absolutePathProjectDist, 'style.css');
fs.createWriteStream(absolutePathStylesDist);
fs.readdir(absolutePathStylesBase, {withFileTypes: true}, (error, files) => {
  showError(error);
  files.forEach(file => {
    const fileName = file.name;
    if (path.extname(fileName) === '.css') {
      const readStream = fs.createReadStream(path.join(absolutePathStylesBase, fileName), 'utf-8');
      readStream.on('data', chunk => {
        fs.appendFile(absolutePathStylesDist, `${chunk}\n`, error => {
          showError(error);
        });
      });
    }
  });
});

fs.readFile(path.join(__dirname, 'template.html'), 'utf-8', (error, data) => {
  let structure = data;
  const absolutePathComponents = path.join(__dirname, 'components');
  fs.readdir(absolutePathComponents, {withFileTypes: true}, (error, files) => {
    const absolutePathIndexHtml = path.join(absolutePathProjectDist, 'index.html');
    files.forEach(file => {
      const fileName = file.name;
      if (path.extname(fileName) === '.html') {
        fs.readFile(path.join(absolutePathComponents, file.name), 'utf-8', (error, data) => {
          const name = fileName.split('.')[0];
          structure = structure.replace(`{{${name}}}`, data);
          fs.writeFile(absolutePathIndexHtml, structure, error => {
            showError(error);
          });
        });
      }
    });
  });
});

function showError(error) {
  if (error) throw error;
}