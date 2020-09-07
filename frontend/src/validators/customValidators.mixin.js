import { validationMixin } from 'vuelidate';

export default {
    mixins: [validationMixin],
    methods: {
        mustBeAfterStartDate(startDate, endDate, inputName = 'endDate', formName = 'formData') {
            const errors = [],
                input = this.$v[formName][inputName];

            if (!input.$dirty) {
                return errors;
            }

            startDate >= endDate && errors.push('end date must be after start date');

            return errors;
        }
    }
};
