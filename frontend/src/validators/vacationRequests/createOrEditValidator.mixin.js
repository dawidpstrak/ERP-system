import { required, requiredIf, email } from 'vuelidate/lib/validators';
import abstractValidatorMixin from '../abstractValidator.mixin';
import customValidatorsMixin from '../customValidators.mixin';
import { mapGetters } from 'vuex';

export default {
    mixins: [abstractValidatorMixin, customValidatorsMixin],

    data() {
        return {
            serverErrors: {
                email: [],
                status: [],
                startDate: [],
                endDate: []
            }
        };
    },
    validations: {
        formData: {
            email: {
                required: requiredIf(function() {
                    return this.isAdmin && this.isCreateModal();
                }),
                email
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
        emailErrors() {
            return this.checkErrors('email');
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
