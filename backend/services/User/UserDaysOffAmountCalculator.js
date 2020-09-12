class UserDaysOffAmountCalculator {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    /*
        onContract ...
     */

    async onContractStore(user, contractAvailableDaysOffAmount) {
        const newAvailableDaysOffAmount = user.availableDaysOffAmount + contractAvailableDaysOffAmount;

        await user.update({ availableDaysOffAmount: newAvailableDaysOffAmount });
    }

    async onContractUpdate(user, oldContractAvailableDaysOffAmount, newContractAvailableDaysOffAmount) {
        const newAvailableDaysOffAmount =
            user.availableDaysOffAmount - oldContractAvailableDaysOffAmount + newContractAvailableDaysOffAmount;

        await user.update({ availableDaysOffAmount: newAvailableDaysOffAmount });
    }

    async onContractChangeOwner(oldOwnerId, newOwner, contractDaysOff, contract) {
        const oldOwner = await this.userRepository.findByPk(oldOwnerId);

        const newOwnerDaysOffAmount = newOwner.availableDaysOffAmount + contractDaysOff;
        const oldOwnerDaysOffAmount = oldOwner.availableDaysOffAmount - contractDaysOff;

        await newOwner.update({ availableDaysOffAmount: newOwnerDaysOffAmount });
        await oldOwner.update({ availableDaysOffAmount: oldOwnerDaysOffAmount });

        await contract.update({ userId: newOwner.id });
    }

    async onContractDelete(userId, contractAvailableDaysOffAmount) {
        const user = await this.userRepository.findByPk(userId);

        const newAvailableDaysOffAmount = user.availableDaysOffAmount - contractAvailableDaysOffAmount;

        await user.update({ availableDaysOffAmount: newAvailableDaysOffAmount });
    }

    /*
        onVacationRequest ...
     */

    async onVacationRequestStore(user, requestedDaysOff) {
        const newAvailableDaysOffAmount = user.availableDaysOffAmount - requestedDaysOff;

        await user.update({ availableDaysOffAmount: newAvailableDaysOffAmount });
    }

    async onVacationRequestUpdate(user, oldRequestedDaysOff, newRequestedDaysOff) {
        const newAvailableDaysOffAmount = user.availableDaysOffAmount + oldRequestedDaysOff - newRequestedDaysOff;

        await user.update({ availableDaysOffAmount: newAvailableDaysOffAmount });
    }

    async onVacationRequestChangeOwner(oldOwnerId, newOwner, requestedDaysOff, vacationRequest) {
        const oldOwner = await this.userRepository.findByPk(oldOwnerId);

        const newOwnerDaysOffAmount = newOwner.availableDaysOffAmount - requestedDaysOff;
        const oldOwnerDaysOffAmount = oldOwner.availableDaysOffAmount + requestedDaysOff;

        await newOwner.update({ availableDaysOffAmount: newOwnerDaysOffAmount });
        await oldOwner.update({ availableDaysOffAmount: oldOwnerDaysOffAmount });

        await vacationRequest.update({ userId: newOwner.id });
    }

    async onVacationRequestDelete(userId, requestedDaysOff) {
        const user = await this.userRepository.findByPk(userId);

        const newAvailableDaysOffAmount = user.availableDaysOffAmount + requestedDaysOff;

        await user.update({ availableDaysOffAmount: newAvailableDaysOffAmount });
    }
}

module.exports = UserDaysOffAmountCalculator;
