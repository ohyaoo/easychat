<template>
    <div id="loginview" v-show="show">
        <transition name="login" mode="out-in">
            <div v-if="isLogin" class="login">
                <button class="close_btn" @click="handleClose"></button>
                <div class="form">
                    <input type="text" name="" id="" v-model="login.identity" placeholder="输入账号">
                    <input type="password" name="" id="" v-model="login.pwd" placeholder="输入密码">
                </div>
                <div class="btn">
                    <el-button type="success" @click="handleLogin" class="login_btn">登&ensp;录</el-button>
                </div>
                <span class="signup" @click="handleGo">注册 ></span>
            </div>
        </transition>
        <transition name="register" mode="out-in">
            <div v-if="!isLogin" class="register">
                <span class="back" @click="handleBack">
                    < 返回</span>
                        <div class="register_form" v-if="isRegister">
                            <div class="form">
                                <input type="text" name="" id="" v-model="register.name" placeholder="输入昵称">
                                <input type="password" name="" id="" v-model="register.pwd" placeholder="输入密码">
                            </div>
                            <div class="btn">
                                <el-button type="success" @click="handleRegister" class="register_btn">注&ensp;册</el-button>
                            </div>
                        </div>
                        <div v-else class="register_done">
                            <p class="register_done_text">{{msg}}</p>
                            <p class="register_done_identity only">{{identity}}</p>
                        </div>

            </div>
        </transition>
    </div>
</template>

<script>
import 'vue-popup-mixin/dist/VuePopupMixin.css';
import Popup from 'vue-popup-mixin';
const { ipcRenderer } = require('electron');
import { mapActions } from 'vuex';
import mqtt from 'mqtt';
export default {
    data() {
        return {
            login: {
                identity: '',
                pwd: ''
            },
            register: {
                name: '',
                pwd: ''
            },
            isLogin: true,
            isRegister: true,
            identity: '',
            msg: ''
        };
    },
    props: ['chat'],
    mixins: [Popup],
    methods: {
        ...mapActions([
            'loginUser',
            'initMessage',
            'receiveMessage',
            'initContacts',
            'initGroups'
        ]),
        handleClose(done) {
            ipcRenderer.send('exit');
        },
        handleGo() {
            this.login.identity = '';
            this.login.pwd = '';
            this.isLogin = false;
        },
        handleBack() {
            this.register.name = '';
            this.register.pwd = '';
            this.isRegister = true;
            this.isLogin = true;
        },
        handleLogin: function() {
            var vm = this;
            this.axios
                .post('/login/login', {
                    userid: vm.login.identity,
                    password: vm.login.pwd
                })
                .then(function(res) {
                    if (res.data.flag === 2) {
                        vm.$emit('update:show', false);
                        ipcRenderer.send('resize');
                        vm.loginUser(res.data.doc);
                        vm.initMessage();
                        vm.receiveMessage();
                        vm.initContacts();
                        vm.initGroups();
                    } else {
                        vm.$message({
                            type: 'info',
                            message: '账号或密码错误'
                        });
                    }
                })
                .catch(function(error) {
                    console.log(error);
                });
        },
        handleRegister: function() {
            let vm = this;
            this.axios
                .post('/login/login_register', {
                    username: vm.register.name,
                    password: vm.register.pwd
                })
                .then(function(res) {
                    vm.isRegister = false;
                    if (res.data.flag) {
                        // console.log(res);
                        vm.identity = '你的帐号:' + res.data.userid;
                        vm.msg = '"注册成功"';
                    }
                })
                .catch(function(err) {
                    console.log(err);
                });
        }
    }
};
</script>

<style lang="scss" scoped>
.login-leave-active,
.login-enter-active {
    transition: all 1s;
}
.login-enter,
.login-leave-to {
    opacity: 0;
    transform: translateX(-100px);
}

#loginview {
    -webkit-app-region: drag;
    width: 100%;
    height: 100%;
    .login {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        .form {
            width: 200px;
            input {
                display: block;
                outline: none;
                border: none;
                border-bottom: 1px solid #d9dcde;
                line-height: 15px;
                padding: 5px 0px;
                width: 70%;
                margin: 15px auto;
                font-size: 16px;
            }
        }
        .btn {
            .login_btn {
                font-weight: 200;
                padding: 12px 15px;
            }
        }
        .close_btn {
            position: absolute;
            top: 0px;
            margin: 14px;
            outline: none;
            border: none;
            width: 14px;
            height: 14px;
            border-radius: 15px;
            background-color: #ff6159;
            &:active {
                background-color: #ff484a;
            }
            &:hover {
                background-image: url('../../static/win_close.png');
                background-repeat: no-repeat;
                background-size: 6px 6px;
                background-position: 50% 50%;
            }
        }
        .signup {
            position: absolute;
            bottom: 0px;
            right: 0px;
            text-decoration: none;
            color: #409eff;
            font-size: 13px;
            margin: 14px;
            font-weight: 200;
            cursor: default;
        }
    }
    .register {
        width: 100%;
        height: 100%;
        // display: flex;
        // align-items: center;
        .register_form {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            .form {
                width: 200px;
                input {
                    display: block;
                    outline: none;
                    border: none;
                    border-bottom: 1px solid #d9dcde;
                    line-height: 15px;
                    padding: 5px 0px;
                    width: 70%;
                    margin: 15px auto;
                    font-size: 16px;
                }
            }
            .btn {
                .register_btn {
                    font-weight: 200;
                    padding: 12px 15px;
                }
            }
        }
        .back {
            position: absolute;
            top: 0px;
            text-decoration: none;
            color: #409eff;
            font-size: 13px;
            margin: 14px;
            font-weight: 200;
            cursor: default;
        }
        .register_done {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            .register_done_text {
                margin: 0;
                font-size: 40px;
                font-weight: 500;
                margin-bottom: 30px;
                // position: absolute;
                // top: 100px;
                cursor: default;
            }
            .register_done_identity {
                -webkit-app-region: no-drag;
                margin: 0;
                font-size: 14px;
            }
        }
    }
}
</style>
