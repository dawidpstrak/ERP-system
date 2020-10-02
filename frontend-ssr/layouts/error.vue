<template>
    <v-app>
        <!-- <side-bar />
        <v-container> {{ title }} </v-container> -->
    </v-app>
</template>

<script>
export default {
    layout: 'default',
    props: {
        error: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            pageNotFound: '404 Not Found',
            otherError: 'An error occurred'
        };
    },
    head() {
        const title = this.error.statusCode === 404 ? this.pageNotFound : this.otherError;
        return {
            title
        };
    }
};
</script>
