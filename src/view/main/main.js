import Vue from "vue";
import MainPage from "./MainPage";
import ElementUI from 'element-ui'
import axios from '../../utils/axios'
import store from '../../vuex/store'
import router from '../../router/router'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI);

new Vue({
    store,
    router,
    el: "#main",
    render: h => h(MainPage),
    components: { MainPage }
});