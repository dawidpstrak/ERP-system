<template>
    <v-app>
        <v-container class="spacer">
            <h2>{{ title }}</h2>
        </v-container>
    </v-app>
</template>

<script>
export default {
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
        return {
            title: this.title
        };
    },

    computed: {
        title() {
            return this.error.statusCode === 404 ? this.pageNotFound : this.otherError;
        }
    }
};
</script>
