<template>
    <v-app>
        <nuxt />
        <notifications
            class="absolute"
            classes="vue-notification"
            position="bottom center"
            :duration="5000"
            :ignoreDuplicates="true"
            :max="1"
        />
    </v-app>
</template>

<style scoped>
.absolute {
    position: absolute; /* workaround for initial rendering with position relative which not allow to render login component at the center */
}
</style>
