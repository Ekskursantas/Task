const fetch = require('node-fetch');

async function retrieveCommissionInfo(url) {
    const response = await fetch(url).catch(err => {
        throw err;
    });
    return await response.json();

}

module.exports = retrieveCommissionInfo;