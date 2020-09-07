import { validationMixin } from 'vuelidate';
import camelCaseToSeparatedString from '../utils/camelCaseToSeparatedString';
import HTTP from 'http-status-codes';

export default {
    mixins: [validationMixin],
    data() {
        return {
            serverErrors: {}
        };
    },
    computed: {
        isValid() {
            return !this.$v.$invalid;
        }
    },
    methods: {
        checkForServerFormErrors(error) {
            if (error.response) {
                if (error.response.status === HTTP.BAD_REQUEST) {
                    error.response.data.errors.map(error => {
                        if (this.serverErrors[error.param]) {
                            this.serverErrors[error.param] = [];
                            this.serverErrors[error.param].push(error.message);
                        }
                    });

                    return true;
                }
                return false;
            }
        },
        clearServerErrors(type) {
            this.serverErrors[type] = [];
        },
        checkServerErrors(inputName) {
            const errors = [],
                serverErrors = this.serverErrors[inputName];

            serverErrors.length && serverErrors.forEach(err => errors.push(err));

            return errors;
        },
        checkRequired(inputName, formName = 'formData') {
            const errors = [],
                input = this.$v[formName][inputName];

            if (!input.$dirty) {
                return errors;
            }

            const separatedInputName = camelCaseToSeparatedString(inputName);

            !input.required && errors.push(separatedInputName + ' field is required');

            return errors;
        },
        checkEmail(inputName, formName = 'formData') {
            const errors = [],
                input = this.$v[formName][inputName];

            if (!input.$dirty) {
                return errors;
            }

            !input.email && errors.push('Invalid ' + inputName);

            return errors;
        },
        checkLength(inputName, formName = 'formData') {
            const errors = [],
                input = this.$v[formName][inputName];

            if (!input.$dirty) {
                return errors;
            }

            !input.minLength && errors.push('minimum ' + input.$params.minLength.min + ' characters');
            !input.maxLength && errors.push('maximum ' + input.$params.maxLength.max + ' characters');

            return errors;
        },
        checkErrors(inputName, formName = 'formData') {
            let errors = [];

            const input = this.$v[formName][inputName];

            if (!input.$dirty) {
                return errors;
            }

            if (input.$params.required) {
                errors = errors.concat(this.checkRequired(inputName, formName));
            }

            if (input.$params.email) {
                errors = errors.concat(this.checkEmail(inputName, formName));
            }

            if (input.$params.minLength || input.$params.maxLength) {
                errors = errors.concat(this.checkLength(inputName, formName));
            }

            errors = errors.concat(this.checkServerErrors(inputName));

            return errors;
        }
    }
};
