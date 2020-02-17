const fs = require('fs');



function readArgFile(fileNames) {
    let readFiles;
    try {
        readFiles = fs.readFileSync(fileNames[0], 'utf8');
    } catch (e) {
        console.error("File does not exist");
        return false;
    }
    return JSON.parse(readFiles);

}
module.exports = readArgFile;