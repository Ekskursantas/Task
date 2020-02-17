const assert = require('chai').assert;
const calculate = require('../calculations');

describe('Commission Calculator', () => {
    it("This test should return 2EUR commission", async function () {
        const entry = {
            "operation": {
                "amount": 200.00,
                "currency": "EUR"
            }
        }
        const protocol = {
            "percents": 1,
            "max": {
                "amount": 22,
                "currency": "EUR"
            }
        }
        let result = await calculate.cashinCalculation(entry, protocol);
        assert.equal(result, 2);
    })

    it('This assertion should throw a wrong currency error', () => {
        const entry = {
            "operation": {
                "amount": 200.00,
                "currency": "RUS"
            }
        }
        const protocol = {
            "percents": 1,
            "min": {
                "amount": 20,
                "currency": "EUR"
            }
        }
        assert.throws(calculate.cashoutLegalCalculation(entry, protocol), "Wrong currency, requested EUR"); // not sure why this is wrong.
    })
})