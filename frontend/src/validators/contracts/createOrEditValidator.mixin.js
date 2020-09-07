import { required, email } from 'vuelidate/lib/validators';
import abstractValidatorMixin from '../abstractValidator.mixin';

export default {
    mixins: [abstractValidatorMixin],
    data() {
        return {
            serverErrors: {
                email: [],
                startDate: [],
                duration: [],
                vacationsPerYear: []
            }
        };
    },
    validations: {
        formData: {
            email: { required, email },
            startDate: { required },
            duration: { required },
            vacationsPerYear: { required }
        }
    },
    computed: {
        emailErrors() {
            return this.checkErrors('email');
        },
        startDateErrors() {
            return this.checkErrors('startDate');
        },
        durationErrors() {
            return this.checkErrors('duration');
        },
        vacationsPerYearErrors() {
            return this.checkErrors('vacationsPerYear');
        }
    }
};
