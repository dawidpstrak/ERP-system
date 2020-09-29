import { required, email, minLength, maxLength } from 'vuelidate/lib/validators';
import abstractValidatorMixin from '@/abstractValidator.mixin';

export default {
    mixins: [abstractValidatorMixin],
    data() {
        return {
            serverErrors: {
                firstName: [],
                lastName: [],
                email: [],
                password: [],
                birthDate: []
            }
        };
    },
    validations: {
        formData: {
            firstName: { required, minLength: minLength(3), maxLength: maxLength(255) },
            lastName: { required, minLength: minLength(3), maxLength: maxLength(255) },
            email: { required, email },
            password: {
                required: (v, obj) => !obj.id,
                minLength: minLength(6),
                maxLength: maxLength(255)
            },
            birthDate: { required }
        }
    },
    computed: {
        firstNameErrors() {
            return this.checkErrors('firstName');
        },
        lastNameErrors() {
            return this.checkErrors('lastName');
        },
        emailErrors() {
            return this.checkErrors('email');
        },
        passwordErrors() {
            return this.checkErrors('password');
        },
        birthDateErrors() {
            return this.checkErrors('birthDate');
        }
    }
};
