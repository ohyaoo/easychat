<template>
    <div id="message" v-if="activeSession.type">
        <ul>
            <li v-for="message in activeSession.message" v-if="activeSession.type === 'user'">
                <div class="datemsg" v-if="message.dateMsg">
                    <span> {{message.dateMsg}}</span>
                </div>
                <div :class="{send:message.type === 'send',receive:message.type === 'receive'}">
                    <div class="avatar">
                        <img :src="message.type==='send'?'../../../static/IMG_1472.jpg':'../../../static/IMG_1472.jpg'" alt="">
                        <span></span>
                    </div>
                    <div class="content">
                        <p>{{message.msg}}</p>
                    </div>
                </div>
            </li>
            <li v-for="message in activeSession.message" v-if="activeSession.type === 'group'">
                <div class="datemsg" v-if="message.dateMsg">
                    <span> {{message.dateMsg}}</span>
                </div>
                <div :class="{send:message.type === 'send',receive:message.type === 'receive'}">
                    <div class="avatar group_avatar">
                        <img :src="message.type==='send'?'../../../static/IMG_1472.jpg':'../../../static/IMG_1472.jpg'" alt="">
                        <span></span>
                    </div>
                    <div class="content group_content">
                        <span v-if="message.type === 'receive'">{{message.user.username}}</span>
                        <p>{{message.msg}}</p>
                    </div>
                </div>
            </li>
            <li v-for="message in activeSession.message" v-if="activeSession.type === 'system'" class="system">
                <div class="message_date">
                    <span> {{message.time}}</span>
                </div>
                <div class="message_box">
                    <img class="useravatar" src="/static/IMG_1472.jpg"></img>
                    <span class="username">{{message.username}}</span>
                    <span class="text">请求加为好友</span>
                    <div @click="addContactAgree(message)" class="agreebtn">
                        <span>同&nbsp;意</span>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
/**@augments
 * updated 虚拟dom改变时，滚动条到底部
 * mounted 在组件重新渲染时，滚动条到底部，主要处理路由，信息界面到聊天界面
 */
import { mapGetters, mapActions } from 'vuex';
export default {
    data() {
        return {
            isShow: true
        };
    },
    computed: {
        ...mapGetters(['userInfo', 'sessions', 'activeSession'])
    },
    updated: function() {
        document.getElementById('message').scrollTop = document.getElementById(
            'message'
        ).scrollHeight;
    },
    mounted: function() {
        if (this.activeSession.user) {
            document.getElementById(
                'message'
            ).scrollTop = document.getElementById('message').scrollHeight;
        }
    },
    methods: {
        ...mapActions(['addContactAgree'])
    }
};
</script>

<style lang="scss" scoped>
#message {
    width: 100%;
    display: flex;
    overflow: scroll;
    flex-grow: 1;
    height: 300px;
    background-color: #f3f3f3;
    border-bottom: 1px solid #e2e2e2;
    ul {
        list-style: none;
        padding: 20px;
        margin: 0;
        width: 100%;
        li {
            .datemsg {
                display: flex;
                justify-content: center;
                margin: 30px 0;
                span {
                    padding: 2px 15px;
                    border-radius: 3px;
                    font-size: 12px;
                    color: #adacac;
                }
            }
            .receive {
                display: flex;
                align-items: flex-start;
                padding: 10px 0 10px;
                .avatar {
                    height: 30px;
                    span {
                        width: 0px;
                        height: 0px;
                        display: block;
                        border-width: 7px 8px;
                        border-style: solid;
                        border-color: transparent #fff transparent transparent;
                        position: relative;
                        top: -26px;
                        right: -30px;
                    }
                    img {
                        border-radius: 3px;
                        width: 30px;
                        height: 30px;
                    }
                }
                .content {
                    position: relative;
                    display: flex;
                    align-items: center;
                    left: 15px;
                    width: 60%;
                    p {
                        display: inline-block;
                        padding: 3px 9px;
                        background-color: #fff;
                        border-radius: 5px;
                        font-size: 12px;
                        margin: 0px;
                        line-height: 25px;
                        letter-spacing: 0.5px;
                    }
                }
                .group_content {
                    flex-direction: column;
                    align-items: flex-start;
                    justify-content: center;
                    span {
                        font-size: 12px;
                        color: #b2b2b2;
                        margin-bottom: 4px;
                        line-height: 12px;
                    }
                }
                .group_avatar {
                    span {
                        top: -11px;
                    }
                }
            }
            .send {
                display: flex;
                justify-content: flex-end;
                align-items: flex-start;
                padding: 10px 0px 10px;
                .avatar {
                    height: 30px;
                    span {
                        width: 0px;
                        height: 0px;
                        display: block;
                        border-width: 7px 8px;
                        border-style: solid;
                        border-color: transparent transparent transparent
                            #a0e75a;
                        position: relative;
                        top: -26px;
                        left: -16px;
                    }
                    img {
                        border-radius: 3px;
                        width: 30px;
                        height: 30px;
                    }
                }

                .content {
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    right: 15px;
                    width: 60%;
                    order: -1;
                    p {
                        display: inline-block;
                        padding: 3px 9px;
                        background-color: #a0e75a;
                        border-radius: 5px;
                        font-size: 12px;
                        margin: 0px;
                        line-height: 25px;
                        letter-spacing: 0.5px;
                    }
                }
            }
        }
        .system {
            .message_date {
                display: flex;
                justify-content: center;
                // margin: 30px 0;
                margin-bottom: 10px;
                span {
                    padding: 2px 15px;
                    border-radius: 3px;
                    font-size: 12px;
                    color: #adacac;
                }
            }
            .message_box {
                height: 90px;
                border: 1px solid #adacac;
                border-radius: 10px;
                margin-bottom: 20px;
                position: relative;
                .useravatar {
                    width: 40px;
                    height: 40px;
                    border-radius: 40px;
                    position: absolute;
                    top: 15px;
                    left: 15px;
                }
                .username {
                    color: #409eff;
                    font-size: 14px;
                    position: absolute;
                    top: 15px;
                    left: 65px;
                }
                .text {
                    font-size: 14px;
                    position: absolute;
                    top: 15px;
                    left: 110px;
                }
                .agreebtn {
                    width: 70px;
                    height: 22px;
                    border-radius: 4px;
                    background-color: #409eff;
                    color: #fff;
                    position: absolute;
                    top: 35px;
                    right: 20px;
                    padding: 0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    span {
                        font-size: 13px;
                        cursor: default;
                    }
                }
            }
        }
    }
}
</style>
