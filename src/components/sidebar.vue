<template>
    <div id="sidebar">
        <div class="winbtn">
            <button class="closebtn" @click="handleClose"></button>
            <button class="shrinkbtn" @click="handleShrink"></button>
            <button class="fullbtn" @click="handleFull" :class="{active:isfill === '1'}"></button>
        </div>
        <div class="card">
            <img src="../../static/IMG_1472.jpg" alt="" class="avatar">
        </div>
        <div class="nav">
            <router-link to="/chatview">
                <div class="icon_chat" :class="{active:view === 0}" @click="selectView(0)"></div>
            </router-link>
            <router-link to="/infoview">
                <div class="icon_info" :class="{active:view === 1}" @click="selectView(1)"></div>
            </router-link>
        </div>
        <div class="toolbtn" @click="istool = !istool">
            <span></span>
        </div>
        <div v-show="istool" class="toolbox">
            <div @click="isconfirm = !isconfirm">
                <span>
                    好友验证消息
                </span>
            </div>
            <div>
                <span>设置</span>
            </div>
        </div>
    </div>
</template>

<script>
const { ipcRenderer } = require('electron');
import { mapGetters, mapActions } from 'vuex';
export default {
    data() {
        return {
            isfill: '0',
            istool: false
        };
    },
    computed: {
        ...mapGetters(['view'])
    },
    methods: {
        ...mapActions(['selectView']),
        handleClose() {
            ipcRenderer.send('exit');
        },
        handleShrink() {
            ipcRenderer.send('shrink');
        },
        handleFull() {
            ipcRenderer.send('full');
        }
    },
    mounted: function() {
        ipcRenderer.on('isfill-reply', (event, arg) => {
            this.test++;
            console.log(this.test);
            this.isfill = arg;
        });
    }
};
</script>

<style lang="scss" scoped>
#sidebar {
    -webkit-app-region: drag;
    width: 100%;
    height: 100%;
    position: relative;
    .winbtn {
        height: 45px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 9px;
        button {
            -webkit-app-region: no-drag;
            padding: 0;
            margin: 0;
            width: 12px;
            height: 12px;
            border-radius: 15px;
            border: none;
            outline: none;
        }
        .closebtn {
            background-color: #ff6159;
            &:active {
                background-color: #ff484a;
            }
        }
        .shrinkbtn {
            background-color: #ffbf2f;
            &:active {
                background-color: #ffb41d;
            }
        }
        .fullbtn {
            background-color: #29cf42;
            &:active {
                background-color: #29b336;
            }
        }
        &:hover {
            .closebtn {
                background-image: url('/static/win_close.png');
                background-repeat: no-repeat;
                background-size: 6px 6px;
                background-position: 50% 50%;
            }
            .shrinkbtn {
                background-image: url('/static/win_shrink.png');
                background-repeat: no-repeat;
                background-size: 10px 10px;
                background-position: 50% 50%;
            }
            .fullbtn {
                background-image: url('/static/win_full.png');
                background-repeat: no-repeat;
                background-size: 16px 16px;
                background-position: 50% 50%;
                &.active {
                    background-image: url('/static/win_refull.png');
                    background-size: 12px 12px;
                    background-position: 50% 50%;
                    background-position-x: 0.03px;
                    background-position-y: -0.05px;
                }
            }
        }
    }
    .card {
        height: 90px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 15px;
        .avatar {
            -webkit-app-region: no-drag;
            width: 45px;
            height: 45px;
            border-radius: 3px;
        }
    }
    .nav {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        a {
            -webkit-app-region: no-drag;
            margin-bottom: 25px;
            .icon_chat {
                width: 33px;
                height: 33px;
                background-image: url('/static/sidebar_chat_grey.png');
                background-repeat: no-repeat;
                background-size: contain;
                &.active {
                    background-image: url('/static/sidebar_chat.png');
                }
                transition: background-image 0.1s;
                cursor: default;
            }
            .icon_info {
                width: 33px;
                height: 33px;
                background-image: url('/static/sidebar_info_grey.png');
                background-repeat: no-repeat;
                background-size: contain;
                &.active {
                    background-image: url('/static/sidebar_info.png');
                }
                transition: background-image 0.1s;
                cursor: default;
            }
        }
    }
    .toolbtn {
        width: 33px;
        height: 33px;
        position: absolute;
        bottom: 25px;
        right: calc(50% - 16.5px);
        display: flex;
        justify-content: center;
        align-items: center;
        span {
            display: inline-block;
            width: 25px;
            height: 24px;
            background-image: url('/static/sidebar_toolbtn.png');
            background-repeat: no-repeat;
            background-size: contain;
        }
    }
    .toolbox {
        width: 120px;
        height: 80px;
        position: absolute;
        background-color: #454545;
        bottom: 20px;
        left: 70px;
        border-radius: 3px;
        display: flex;
        flex-direction: column;
        div {
            flex-grow: 1;
            color: #969696;
            &:hover {
                background-color: #575859;
                border-radius: 3px;
            }
            &:active {
                color: #767575;
            }
            span {
                cursor: default;
                font-size: 14px;
                line-height: 40px;
                padding-left: 10px;
            }
        }
    }
}
</style>
