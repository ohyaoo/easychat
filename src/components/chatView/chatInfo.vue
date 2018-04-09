<template>
    <div id="chat_info" v-if="activeSession.type" @click="handleClose">
        <span class="username" v-if="activeSession.type === 'user'">{{activeSession.user.username}}</span>
        <span class="username" v-if="activeSession.type === 'group'">{{activeSession.group.groupname}}</span>
        <span class="username" v-if="activeSession.type === 'system'">{{activeSession.system.name}}</span>
        <span class="info_icon" @click.stop="handleInfo" v-if="activeSession.type !== 'system'"></span>
        <transition name="fade">
            <div class="info_box" v-if="isInfo" @click.stop="handleBox">
                <div class="add_box" @click="handleAdd">
                    <span class="add_btn">+</span>
                    <span class="add_text">添加成员</span>
                </div>
                <ul class="info">
                    <li v-for="user in userList">
                        <img src="../../../static/IMG_1472.jpg" alt="">
                        <span>{{user.username}}</span>
                    </li>
                </ul>
            </div>
        </transition>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
    props: ['isInfo'],
    computed: {
        ...mapGetters(['activeSession', 'userList'])
    },
    methods: {
        handleBox() {},
        handleInfo() {
            this.$emit('update:isInfo', !this.isInfo);
        },
        handleClose() {
            this.$emit('update:isInfo', false);
        },
        handleAdd() {}
    }
};
</script>


<style lang="scss" scoped>
.fade-enter-active {
    transition: all 0.5s;
}
.fade-leave-active {
    transition: all 0.5s;
}
.fade-enter,
.fade-leave-to {
    transform: translateX(235px);
    //   opacity: 0;
}
#chat_info {
    -webkit-app-region: drag;
    width: 100%;
    height: 49px;
    background-color: #ffffff;
    border-bottom: 1px solid #e2e2e2;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .username {
        font-size: 17px;
        padding-left: 20px;
        font-weight: 600;
    }
    .info_icon {
        background: url(../../../static/chatinfo_one.png);
        width: 20px;
        height: 20px;
        background-repeat: no-repeat;
        background-size: 20px 20px;
        margin-right: 22px;
        &:active {
            background-image: url(../../../static/chatinfo_one_light.png);
            transition: 0s;
        }
        transition: background-image 3s;
    }
    .info_box {
        position: absolute;
        width: 235px;
        height: calc(100% - 51px);
        top: 51px;
        right: 0px;
        border-left: 1px solid #e2e2e2;
        background-color: #f9f9f9;
        z-index: 1000;
        .add_box {
            height: 45px;
            display: flex;
            align-items: center;
            padding-left: 20px;
            &:active {
                background-color: #efefef;
                transition: 0s;
            }
            transition: background-color 0.5s;
            cursor: default;
            .add_btn {
                display: inline-block;
                height: 27px;
                width: 27px;
                border: 1px solid #7c7c7c;
                border-radius: 2px;
                line-height: 22px;
                font-size: 27px;
                font-weight: 100;
                text-align: center;
                position: relative;
                color: #7c7c7c;
            }
            .add_text {
                font-size: 14px;
                padding-left: 15px;
                font-weight: 500;
            }
        }
        .info {
            list-style: none;
            padding: 0px;
            margin: 0;
            cursor: default;
            li {
                height: 45px;
                padding-left: 20px;
                display: flex;
                align-items: center;
                img {
                    width: 29px;
                    height: 29px;
                    border-radius: 2px;
                }
                span {
                    font-size: 14px;
                    padding-left: 15px;
                    font-weight: 600;
                }
                &:active {
                    background-color: #efefef;
                    transition: 0s;
                }
                transition: background-color 0.5s;
            }
        }
    }
}
</style>

