<template>
    <div id="mainpage">
        <app v-if="isChat" class="app"></app>
        <!-- <el-dialog title="wechat" :visible.sync="dialogFormVisible" :before-close="handleClose" :close-on-click-modal="false" fullscreen center>
            <el-form :model="form">
                <el-form-item label="账号" :label-width="formLabelWidth">
                    <el-input v-model="form.identity" auto-complete="off" id=""></el-input>
                </el-form-item>
                <el-form-item label="密码" :label-width="formLabelWidth">
                    <el-input v-model="form.pwd" auto-complete="off" type="password"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="success" @click="handleLogin">登录</el-button>
            </div>
        </el-dialog> -->
        <login-view :show.sync="isShow" class="login_view"></login-view>
    </div>
</template>

<script>
const { ipcRenderer } = require('electron');
import App from '../../components/App';
import LoginView from '../../components/loginView';
import { mapActions } from 'vuex';
export default {
    data() {
        return {
            // dialogFormVisible: true,
            // form: {
            //     identity: '',
            //     pwd: ''
            // },
            // formLabelWidth: '40px';
            isShow: true,
            isChat: false
        };
    },
    watch: {
        isShow: function() {
            this.isChat = true;
        }
    },
    // methods: {
    //     ...mapActions([
    //         'loginUser',
    //         'initMessage',
    //         'receiveMessage',
    //         'initContacts'
    //     ]),
    //     handleClose(done) {
    //         ipcRenderer.send('exit');
    //     },
    //     handleLogin: function() {
    //         var vm = this;
    //         this.axios
    //             .post(
    //                 '/user/signin',
    //                 {
    //                     identity: vm.form.identity,
    //                     pwd: vm.form.pwd
    //                 },
    //                 {
    //                     baseURL: 'http://127.0.0.1:3000'
    //                 }
    //             )
    //             .then(function(res) {
    //                 if (res.data.flag === 2) {
    //                     vm.dialogFormVisible = false;
    //                     vm.isShow = false;
    //                     vm.chat = true;
    //                     ipcRenderer.send('resize');
    //                     vm.loginUser(res.data.doc);
    //                     vm.initMessage();
    //                     vm.receiveMessage();
    //                     vm.initContacts();
    //                 } else {
    //                     vm.$message({
    //                         type: 'info',
    //                         message: '账号或密码错误'
    //                     });
    //                 }
    //             })
    //             .catch(function(error) {
    //                 console.log(error);
    //             });
    //     }
    // },
    components: {
        App,
        LoginView
    }
};
</script>

<style lang="scss">
html {
    height: 100%;
    font-family: 'PingFangSC-Light';
    body {
        margin: 0;
        padding: 0;
        height: 100%;
        #mainpage {
            height: 100%;
            overflow: hidden;
            .app {
                height: 100%;
                width: 100%;
            }
            .login_view {
                height: 100%;
                width: 100%;
                background-color: #fff;
            }
        }
    }
}
</style>