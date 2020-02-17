const Commissions = require("./commissions");

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
            const commisionFee = entry.operation.amount * cashInProtocol.percents / 100;
            if (commisionFee > cashInProtocol.max.amount) {
                return cashInProtocol.max.amount.toFixed(2);
            } else {
                return roundUp(commisionFee);
            }
        } else if (entry.type == "cash_out" && entry.user_type == "natural") {
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
            const lastTransactionWeek = (new Date).getWeekNumber(user.lastTransaction);
            const newTransactionWeek = (new Date).getWeekNumber(newTranscation);

            if (lastTransactionWeek != newTransactionWeek ||
                (lastTransactionWeek == newTransactionWeek && user.lastTransaction.getFullYear() != newTranscation.getFullYear())) {
                deductedAmount = entry.operation.amount - cashoutNaturalProtocol.week_limit.amount;
                if (deductedAmount > 0) {
                    user.amountLeft = 0;
                } else {
                    user.amountLeft = Math.abs(deductedAmount);
                    deductedAmount = 0;
                }
            } else {
                deductedAmount = entry.operation.amount - user.amountLeft;
                if (deductedAmount > 0) {
                    user.amountLeft = 0;
                } else {
                    user.amountLeft = Math.abs(deductedAmount);
                    deductedAmount = 0;
                }
            }
            user.lastTransaction = newTranscation;
            const commisionFee = deductedAmount * cashoutLegalProtocol.percents / 100;

            return roundUp(commisionFee);




        } else if (entry.type == "cash_out" && entry.user_type == "juridical") {
            const commisionFee = entry.operation.amount * cashoutLegalProtocol.percents / 100;
            if (commisionFee > cashoutLegalProtocol.min.amount) {
                return roundUp(commisionFee);
            } else {
                return "Request canceled. The amount is too small";
            }
        }
    })
    console.log(calculatedCommissionList);

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

module.exports = calculateCommissions;