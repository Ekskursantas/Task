const readfile = require("./filereader");
const calculate = require("./calculations");

async function start() {
    const fileResults = readfile();
    if (fileResults) {
        calculate(fileResults);
    } else {
        console.log("You have not inputed a list file");
    }
}

start();