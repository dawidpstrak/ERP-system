class ContractOverlapHandler {
    constructor(contractRepository) {
        this.contractRepository = contractRepository;
    }

    async isAnyContractOverlaping(startDate, endDate, userId, contractId = null) {
        const contracts = await this.contractRepository.findAllByUserInTimeInterval(
            startDate,
            endDate,
            userId,
            contractId
        );

        if (contracts.length) {
            return true;
        }

        return false;
    }
}

module.exports = ContractOverlapHandler;
