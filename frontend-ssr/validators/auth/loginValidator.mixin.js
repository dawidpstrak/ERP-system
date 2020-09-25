import { required, minLength, maxLength, email } from 'vuelidate/lib/validators';
import abstractValidatorMixin from '../abstractValidator.mixin';

export default {
    mixins: [abstractValidatorMixin],
    data() {
        return {
            serverErrors: {
                email: [],
                password: []
            }
        };
    },
    validations: {
        credentials: {
            email: { required, email },
            password: {
                required,
                minLength: minLength(6),
                maxLength: maxLength(32)
            }
        }
    },
    computed: {
        emailErrors() {
            return this.checkErrors('email', 'credentials');
        },
        passwordErrors() {
            return this.checkErrors('password', 'credentials');
        }
    }
};
