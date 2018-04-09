<template>
    <div id="app">
        <div class="sidebar">
            <sidebar></sidebar>
        </div>
        <div class="view">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
import Sidebar from '../components/sidebar';

export default {
    components: {
        Sidebar
    }
};
</script>

<style lang="scss" scoped>
#app {
    display: flex;
    .sidebar {
        width: 70px;
        height: 100%;
        background-color: #0f1216;
    }
    .view{
        width: 710px;
        height: 100%;
        flex-grow: 1;
    }
}
</style>