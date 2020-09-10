<template>
    <v-dialog v-model="showConfirmDelete" width="400" persistent>
        <v-card>
            <v-card-title class="headline grey lighten-2">
                Are you sure ?
            </v-card-title>

            <v-card-text class="mt-6"> Are you sure you wanna delete this {{ resourceName }} ?</v-card-text>

            <v-divider />

            <v-card-actions>
                <v-spacer />
                <v-btn color="primary" text @click="onCancel">
                    cancel
                </v-btn>
                <v-btn color="error" text @click="onConfirm">
                    confirm
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    props: {
        resourceName: String,
        showConfirmDelete: Boolean
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
