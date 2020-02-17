const Commissions = require("./commissions");
const write = require("./writer");
async function calculateCommissions(fileResults) {
    const _commissions = new Commissions();
    const cashInProtocol = await _commissions.cashin();
    const cashoutLegalProtocol = await _commissions.cashoutLegal();
    const cashoutNaturalProtocol = await _commissions.cashoutNatural();

    /*
    user object structure:
    user = {
        user_id,
        lastTransaction,
        amountLeft
    }
    */

    let naturalUsers = [];

    const calculatedCommissionList = fileResults.map(entry => {
        if (entry.type == "cash_in") {
            return cashinCalculation(entry, cashInProtocol);
        } else if (entry.type == "cash_out" && entry.user_type == "natural") {
            return cashoutNaturalCalculation(entry, cashoutNaturalProtocol, naturalUsers);
        } else if (entry.type == "cash_out" && entry.user_type == "juridical") {
            return cashoutLegalCalculation(entry, cashoutLegalProtocol);
        }
    })
    calculatedCommissionList.forEach(commissions => {
        write(commissions + '\n');
    });

}

function cashinCalculation(entry, cashInProtocol) {
    if (entry.operation.currency !== cashInProtocol.max.currency) {
        throw new Error(`Wrong currency, requested ${cashInProtocol.max.currency}`);
    }
    const commisionFee = entry.operation.amount * cashInProtocol.percents / 100;
    if (commisionFee > cashInProtocol.max.amount) {
        return cashInProtocol.max.amount.toFixed(2); //addind two decimal places after the comma.
    } else {
        return roundUp(commisionFee);
    }
}

function cashoutNaturalCalculation(entry, cashoutNaturalProtocol, naturalUsers) {
    if (entry.operation.currency !== cashoutNaturalProtocol.week_limit.currency) {
        throw new Error(`Wrong currency, requested ${cashoutNaturalProtocol.week_limit.currency}`);
    }
    let user = naturalUsers.filter(natural => (natural.user_id === entry.user_id))[0];
    if (!user) {
        user = {
            user_id: entry.user_id,
            lastTransaction: new Date(entry.date),
            amountLeft: cashoutNaturalProtocol.week_limit.amount
        }
        naturalUsers.push(user);
    }

    let deductedAmount = 0;
    const newTranscation = new Date(entry.date);
    const lastTransactionWeek = (new Date).getWeekNumber(user.lastTransaction); //calculating the week number
    const newTransactionWeek = (new Date).getWeekNumber(newTranscation);

    if (lastTransactionWeek != newTransactionWeek ||
        (lastTransactionWeek == newTransactionWeek && user.lastTransaction.getFullYear() != newTranscation.getFullYear())) { //checking if the week number is the same, but has different year
        deductedAmount = entry.operation.amount - cashoutNaturalProtocol.week_limit.amount;
        if (deductedAmount > 0) {
            user.amountLeft = 0;
        } else {
            user.amountLeft = Math.abs(deductedAmount);
            deductedAmount = 0;
        }
    } else {
        deductedAmount = entry.operation.amount - user.amountLeft;
        if (deductedAmount > 0) { //if deducted sum is negative that means that the amout free of charge is greater and the result is the left amout of free of charge sum, so we abs it to make it possitive.
            user.amountLeft = 0;
        } else {
            user.amountLeft = Math.abs(deductedAmount);
            deductedAmount = 0;
        }
    }
    user.lastTransaction = newTranscation;
    const commisionFee = deductedAmount * cashoutNaturalProtocol.percents / 100;

    return roundUp(commisionFee);
}

function cashoutLegalCalculation(entry, cashoutLegalProtocol) {
    if (entry.operation.currency !== cashoutLegalProtocol.min.currency) {
        throw new Error(`Wrong currency, requested ${cashoutLegalProtocol.min.currency}`);
    }
    const commisionFee = entry.operation.amount * cashoutLegalProtocol.percents / 100;
    if (commisionFee > cashoutLegalProtocol.min.amount) {
        return roundUp(commisionFee);
    } else {
        throw new Error("Request canceled. The amount is too small");
    }
}

function roundUp(number) {
    return (Math.round((number + Number.EPSILON) * 100) / 100).toFixed(2);
}

Date.prototype.getWeekNumber = function (date) {
    var d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    var dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
};

module.exports = {
    calculateCommissions,
    cashinCalculation,
    cashoutNaturalCalculation,
    cashoutLegalCalculation
};