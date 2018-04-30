<template>
    <router-view></router-view>
</template>


<script>
    import Controls from './views/controls.vue';
    import Games from './views/games.vue';

    export default {
        name: 'App',
        data() {
            return {
                message: 'Hello World!'
            }
        },
        components: {
            Controls,
            Games
        },
        methods: {
            selectedButton: function() {
                var controls = document.getElementsByClassName('controller-button');
                controls.foreach(function(item) {
                    this.classList.remove("active");
                });
                this.classList.add("active");
            }
        }
    }
</script>
