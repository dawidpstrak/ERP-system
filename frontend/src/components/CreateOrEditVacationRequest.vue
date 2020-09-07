<template>
    <div class="overlay">
        <v-form class="pa-10 white col-4" @submit.prevent="submit">
            <button class="exit-btn" @click="onClose">
                <v-icon>{{ 'mdi-location-exit' }}</v-icon>
            </button>

            <v-toolbar-title class="mb-6 text-h4" align="center">{{ formTitle() }}</v-toolbar-title>

            <v-text-field
                v-if="isAdmin && isCreateModal()"
                v-model="formData.email"
                :error-messages="emailErrors"
                label="Employee email"
                @input="$v.formData.email.$touch()"
                @blur="$v.formData.email.$touch()"
                @keyup="clearServerErrors('email')"
            />

            <v-select
                v-if="isAdmin"
                v-model="formData.status"
                label="Set request status"
                :items="requestStatuses"
                :error-messages="statusErrors"
                @input="$v.formData.status.$touch()"
                @blur="$v.formData.status.$touch()"
                @keyup="clearServerErrors('status')"
            />

            <v-menu :nudge-right="40" :close-on-content-click="false" min-width="none" transition="scale-transition">
                <template v-slot:activator="{ on }">
                    <v-text-field
                        class="mb-2"
                        label="Start date"
                        :error-messages="startDateErrors"
                        :value="formData.startDate"
                        readonly
                        v-on="on"
                        @input="$v.formData.startDate.$touch()"
                        @blur="$v.formData.startDate.$touch()"
                        @keyup="clearServerErrors('startDate')"
                    />
                </template>

                <v-date-picker v-model="formData.startDate" no-title />
            </v-menu>

            <v-menu :nudge-right="40" :close-on-content-click="false" min-width="none" transition="scale-transition">
                <template v-slot:activator="{ on }">
                    <v-text-field
                        class="mb-2"
                        label="End date"
                        :error-messages="endDateErrors"
                        :value="formData.endDate"
                        readonly
                        v-on="on"
                        @input="$v.formData.endDate.$touch()"
                        @blur="$v.formData.endDate.$touch()"
                        @keyup="clearServerErrors('endDate')"
                    />
                </template>

                <v-date-picker v-model="formData.endDate" no-title />
            </v-menu>

            <v-container>
                <v-btn class="mr-4" type="submit">submit</v-btn>

                <v-btn v-if="!isCreateModal()" class="ml-10" depressed color="error" @click="onDelete">Delete</v-btn>
            </v-container>
        </v-form>
    </div>
</template>

<script>
import moment from 'moment';
import { mapActions, mapGetters } from 'vuex';
import createOrEditValidation from '@/validators/vacationRequests/createOrEditValidator.mixin';
import NotifyingService from '@/services/NotifyingService';

export default {
    props: {
        selectedItem: Object
    },

    mixins: [createOrEditValidation],

    data() {
        return {
            formData: {
                email: '',
                startDate: '',
                endDate: '',
                status: 'pending'
            },
            requestStatuses: ['active', 'pending']
        };
    },

    computed: {
        ...mapGetters(['isAdmin'])
    },

    created() {
        !this.isCreateModal() && this.setEditData();
    },

    methods: {
        ...mapActions(['saveVacationRequest', 'deleteVacationRequest']),

        async submit() {
            this.$v.$touch();

            if (this.$v.$invalid) {
                return;
            }

            try {
                await this.saveVacationRequest(this.formData);

                this.formData.id
                    ? NotifyingService.updated('vacation request')
                    : NotifyingService.created('vacation request');
            } catch (error) {
                if (!this.checkForServerFormErrors(error)) {
                    NotifyingService.handleError(error);
                }

                console.error(error);
            }
        },

        async onDelete() {
            try {
                await this.deleteVacationRequest(this.formData.id);

                NotifyingService.deleted('vacation request');
            } catch (error) {
                NotifyingService.handleError(error);

                console.error(error);
            }
        },

        formTitle() {
            return this.isCreateModal() ? 'New vacation' : 'Edit vacation';
        },

        onClose() {
            this.$emit('closeModal');
        },

        calculateVacationDuration(endDate, startDate) {
            const vacationStart = moment(startDate);
            const vacationEnd = moment(endDate);

            const vacationDuration = moment.duration(vacationEnd.diff(vacationStart)).days();

            return vacationDuration;
        },

        setEditData() {
            this.formData = { ...this.selectedItem };
        },

        isCreateModal() {
            return !this.selectedItem;
        }
    }
};
</script>

<style lang="scss" scoped>
.overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(102, 106, 107, 0.63);
    display: flex;
    justify-content: center;
    align-items: center;
}
form {
    position: relative;
}
.exit-btn {
    position: absolute;
    right: 20px;
    top: 20px;
}
</style>
