import { required } from 'vuelidate/lib/validators';
import abstractValidatorMixin from '../abstractValidator.mixin';

export default {
    mixins: [abstractValidatorMixin],
    data() {
        return {
            serverErrors: {
                userId: [],
                startDate: [],
                duration: [],
                vacationsPerYear: []
            }
        };
    },
    validations: {
        formData: {
            userId: { required },
            startDate: { required },
            duration: { required },
            vacationsPerYear: { required }
        }
    },
    computed: {
        userIdErrors() {
            return this.checkErrors('userId');
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
