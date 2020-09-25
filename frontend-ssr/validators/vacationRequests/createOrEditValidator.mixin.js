import { required, requiredIf } from 'vuelidate/lib/validators';
import abstractValidatorMixin from '../abstractValidator.mixin';
import customValidatorsMixin from '../customValidators.mixin';
import { mapGetters } from 'vuex';

export default {
    mixins: [abstractValidatorMixin, customValidatorsMixin],

    data() {
        return {
            serverErrors: {
                userId: [],
                status: [],
                startDate: [],
                endDate: []
            }
        };
    },
    validations: {
        formData: {
            userId: {
                required: requiredIf(function() {
                    return this.isAdmin;
                })
            },
            status: {
                required: requiredIf(function() {
                    return this.isAdmin;
                })
            },
            startDate: { required },
            endDate: { required }
        }
    },
    computed: {
        ...mapGetters(['isAdmin']),
        userIdErrors() {
            return this.checkErrors('userId');
        },
        statusErrors() {
            return this.checkErrors('status');
        },
        startDateErrors() {
            return this.checkErrors('startDate');
        },
        endDateErrors() {
            return this.checkErrors('endDate').concat(
                this.mustBeAfterStartDate(this.formData.startDate, this.formData.endDate)
            );
        }
    }
};
