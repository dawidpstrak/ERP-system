<template>
    <v-dialog v-model="showConfirmDelete" width="400" persistent>
        <v-card>
            <v-card-title>
                Are you sure ?
            </v-card-title>

            <v-divider />

            <v-card-text class="mt-6"> Are you sure you wanna delete this {{ resourceName }} ?</v-card-text>

            <v-divider />

            <v-card-actions>
                <v-spacer />
                <v-btn color="primary" outlined @click="onCancel">
                    cancel
                </v-btn>
                <v-btn data-cy="confirm-delete" color="error" outlined @click="onConfirm">
                    confirm
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    props: {
        resourceName: {
            type: String,
            required: true
        },

        showConfirmDelete: {
            type: Boolean,
            required: true
        }
    },

    methods: {
        onConfirm() {
            this.$emit('confirmed');
        },
        onCancel() {
            this.$emit('canceled');
        }
    }
};
</script>
