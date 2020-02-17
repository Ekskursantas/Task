const assert = require('chai').assert;
const fetch = require('../fetcher');

describe('Fetcher', function () {
    it("Fetcher should return an object with property 'percents' that has a value '0.3'", async function () {
        let result = await fetch('http://private-38e18c-uzduotis.apiary-mock.com/config/cash-out/juridical');
        assert.equal(result.percents, 0.3);
    })
})