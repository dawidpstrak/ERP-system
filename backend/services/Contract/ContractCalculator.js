class ContractCalculator {
    constructor(contractRepository, moment) {
        this.contractRepository = contractRepository;
        this.moment = moment;
    }

    daysOffAmount(vacationsPerYear, duration) {
        return Math.round((vacationsPerYear / 12) * duration);
    }

    endDate(startDate, duration) {
        return this.moment(startDate).add(duration, 'M').subtract(1, 'day').format('YYYY-MM-DD');
    }
}

module.exports = ContractCalculator;
