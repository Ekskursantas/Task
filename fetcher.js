const fetch = require('node-fetch');

async function retrieveCommissionInfor(url) {
    await fetch(url)
        .then(response => response.json())
        .then(data => {
            return data;
        })
        .catch(err => {
            console.log("Error", err)
        })
}

module.exports = retrieveCommissionInfor;