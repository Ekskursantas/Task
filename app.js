const readfile = require("./filereader");
const calculate = require("./calculations").calculateCommissions;

async function start() {
    const arg = process.argv.splice(2);
    const fileResults = readfile(arg);
    if (!fileResults) return;
    try {
        calculate(fileResults);
    } catch (e) {

        console.error(e);
    }
}

start();