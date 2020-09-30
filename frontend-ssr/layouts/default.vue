<template>
    <v-app>
        <nuxt />

        <client-only>
            <notifications
                class="fixed"
                classes="vue-notification"
                position="bottom center"
                :duration="5000"
                :ignoreDuplicates="true"
                :max="1"
            />
        </client-only>
    </v-app>
</template>

<style scoped>
.fixed {
    position: fixed; /* workaround for initial rendering with position relative which not allow to render login component at the center */
}
</style>
