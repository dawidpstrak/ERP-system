<template>
    <v-autocomplete
        v-model="employee"
        :items="employees"
        :loading="isLoading"
        label="Employee"
        :error-messages="errorMessages"
        hide-no-data
        hide-selected
        placeholder="Start typing to Search"
        item-text="fullName"
        item-value="id"
        return-object
        @update:search-input="onUpdateEmployeeSearch"
        @change="onChangeEmployee"
    />
</template>

<script>
import { mapActions } from 'vuex';

export default {
    props: {
        value: {
            type: String,
            required: true
        },
        userData: {
            type: Object,
            required: true
        },
        errorMessages: {
            type: Array,
            required: true
        }
    },

    data() {
        return {
            employee: {},
            searchedEmployees: [],
            isLoading: false,
            minimumQuerySearchLength: 3
        };
    },

    created() {
        const isEditMode = this.value;

        if (isEditMode) {
            this.employee = {
                id: this.value,
                fullName: this.userData.firstName + ' ' + this.userData.lastName,
                ...this.userData
            };

            this.searchedEmployees.push(this.employee);
        }
    },

    computed: {
        employees() {
            return this.searchedEmployees.map(e => {
                return {
                    id: e.id,
                    fullName: e.firstName + ' ' + e.lastName
                };
            });
        }
    },

    methods: {
        ...mapActions({ fetchUsers: 'users/fetchUsers' }),

        async onUpdateEmployeeSearch(query) {
            if (!query || this.isLoading || query.length < this.minimumQuerySearchLength) {
                return;
            }

            if (this.employee && this.employee.fullName === query) {
                return;
            }

            this.isLoading = true;

            this.searchedEmployees = await this.fetchUsers(query);

            this.isLoading = false;
        },

        onChangeEmployee(employee) {
            if (employee) {
                this.$emit('input', employee.id);
            }
        }
    }
};
</script>
