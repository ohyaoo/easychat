import Vue from 'vue'
import Router from 'vue-router'

import ChatView from '../components/chatView';
import InfoView from '../components/infoView';


Vue.use(Router)

export default new Router({
    routes: [
        { path: '/chatview', component: ChatView },
        { path: '/infoview', component: InfoView },
        { path: '*', redirect: '/chatview' }
    ]
})