const path = require('path');
const parseArgs = require('minimist');
const { generateResponsiveImages } = require('responsive-images-generator/lib');

const configs = require('./generate-web-image.conf');

(() => {
  const arguments = parseArgs(process.argv);
  const fileName = arguments.file;
  const hasFileName = fileName && fileName.length > 0;
  if (!hasFileName) {
    console.error(`[ generate-web-image.js ] "file" argument is missing.`);
    exit(1);
  }

  // __dirname where the script lives
  const images = [
    path.join(__dirname, fileName),
  ];
  generateResponsiveImages(images, configs);
})();
