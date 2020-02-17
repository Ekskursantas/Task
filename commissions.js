const fetch = require('./fetcher');
class Commissions {
    cashin() {
        const response = fetch("http://private-38e18c-uzduotis.apiary-mock.com/config/cash-in");
        return response;
    }

    cashoutLegal() {
        const response = fetch("http://private-38e18c-uzduotis.apiary-mock.com/config/cash-out/juridical")
        return response;
    }

    cashoutNatural() {
        const response = fetch("http://private-38e18c-uzduotis.apiary-mock.com/config/cash-out/natural");
        return response;
    }
}

module.exports = Commissions;