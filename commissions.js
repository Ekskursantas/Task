const fetch = require('./fetcher');
class Commissions {
    cashin() {
        const response = fetch("http://private-38e18c-uzduotis.apiary-mock.com/config/cash-in");
        console.log(response);
    }

    cashoutLegal() {
        const response = fetch("http://private-38e18c-uzduotis.apiary-mock.com/config/cash-out/juridical");
        console.log(response);
    }

    cashoutNatural() {
        const response = fetch("http://private-38e18c-uzduotis.apiary-mock.com/config/cash-out/natural");
        console.log(response);
    }
}

module.exports = Commissions;