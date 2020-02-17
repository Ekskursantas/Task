const fs = require('fs');



function readArgFiles() {
    let fileArray = [];
    const fileNames = process.argv.splice(2);

    if (fileNames.length <= 0) return false;
    const readFiles = fs.readFileSync(fileNames[0], 'utf8');
    return JSON.parse(readFiles);
}
module.exports = readArgFiles;