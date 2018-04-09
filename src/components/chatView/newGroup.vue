<template>
    <transition name="fade">
        <div id="newgroup" v-if="show">
            <div class="one_part userlist_part">
                <div class="search_box">
                    <input type="text" name="" class="search">
                </div>
                <ul class="userlist">
                    <li v-for="contact in contacts" :class="{active:active === contact}" @click="handleClick(contact)">
                        <img src="../../../static/IMG_1472.jpg" alt="" class="avatar">
                        <span>{{contact.username}}</span>
                    </li>
                </ul>
            </div>
            <div class="one_part userlist_checked_part">
                <div class="checked_text">
                    <span>已选择联系人</span>
                </div>
                <ul class="userlist_checked">
                    <li v-for="contact in checked">
                        <img src="../../../static/IMG_1472.jpg" alt="" class="avatar">
                        <span>{{contact.username}}</span>
                    </li>
                </ul>
                <div class="btn_box">
                    <button @click="handleClose" class="btn cancel">取消</button>
                    <button class="btn certain disabled" disabled @click="handleConfirm">确定</button>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
export default {
    data() {
        return {
            active: {},
            checked: []
        };
    },
    props: ['show'],
    computed: {
        ...mapGetters(['contacts'])
    },
    methods: {
        ...mapActions(['addChat', 'addGroup']),
        handleClose() {
            this.active = {};
            this.checked = [];
            this.$emit('update:show', false);
        },
        handleClick(contact) {
            let one = this.checked.filter(function(user) {
                return user.userid === contact.userid;
            });
            if (one[0]) {
                this.checked = this.checked.filter(function(user) {
                    return user.userid !== contact.userid;
                });
            } else {
                let new_contact = {
                    userid: contact.userid,
                    username: contact.username,
                    useravatar: contact.useravatar,
                    flag: contact.flag
                };
                this.checked.push(new_contact);
            }
            this.active = contact;
        },
        /**@augments
         * handleConfirm 确认
         * 如果checked只有一个联系人，则调用addChat直接与这个联系人聊天
         * checked有两个及以上联系人，调用addGroup
         */
        handleConfirm() {
            if (this.checked.length === 1) {
                this.addChat(this.checked[0]);
            } else {
                this.addGroup(this.checked);
            }
            this.handleClose();
        }
    },
    watch: {
        checked: function() {
            let certain = document.getElementsByClassName('certain')[0];
            if (this.checked.length > 0) {
                certain.disabled = false;
                certain.classList.remove('disabled');
            } else {
                certain.disabled = true;
                certain.classList.add('disabled');
            }
        }
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
.fade-enter {
    transform: translateY(-450px);
}
.fade-leave-to {
    transform: translateY(-450px);
}
#newgroup {
    z-index: 1001;
    width: 640px;
    height: 450px;
    position: absolute;
    top: 0;
    left: calc(50% - 320px);
    background-color: #fff;
    box-shadow: 0px 0px 5px #808080;
    display: flex;
    .one_part {
        box-sizing: content-box;
        width: 50%;
        height: 100%;
    }
    .userlist_part {
        overflow: scroll;
        border-right: 1px solid #e2e2e2;
        .search_box {
            height: 45px;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            .search {
                width: 265px;
                line-height: 20px;
                border: 1px solid #d0d0d0;
                background-color: #e1e1e1;
                border-radius: 3px;
                padding: 0 5px;
                outline: none;
            }
        }
        .userlist {
            list-style: none;
            margin: 0;
            padding: 0;
            li {
                display: flex;
                align-items: center;
                padding: 8px 0px 8px 20px;
                .avatar {
                    width: 32px;
                    height: 32px;
                    border-radius: 2px;
                }
                span {
                    cursor: default;
                    margin: 0;
                    font-size: 16px;
                    color: #000;
                    padding-left: 15px;
                }
                &.active {
                    background-color: #e5e5e5;
                }
            }
        }
    }
    .userlist_checked_part {
        display: flex;
        flex-direction: column;
        .checked_text {
            height: 50px;
            padding-left: 20px;
            display: flex;
            align-items: center;
            span {
                font-size: 12px;
                color: #888888;
            }
        }
        .userlist_checked {
            overflow: scroll;
            flex-grow: 1;
            list-style: none;
            margin: 0;
            padding: 0;
            li {
                display: flex;
                align-items: center;
                padding: 8px 0px 8px 20px;
                .avatar {
                    width: 32px;
                    height: 32px;
                    border-radius: 2px;
                }
                span {
                    cursor: default;
                    margin: 0;
                    font-size: 16px;
                    color: #000;
                    padding-left: 15px;
                }
                &.active {
                    background-color: #e5e5e5;
                }
            }
        }
        .btn_box {
            height: 50px;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            .btn {
                height: 28px;
                width: 90px;
                padding: 0;
                font-weight: 400;
                font-size: 14px;
            }
            .certain {
                margin-left: 20px;
                margin-right: 20px;
                outline: none;
                background-color: #3fba39;
                border: 1px solid #3fba39;
                border-radius: 5px;
                color: #ffffff;
                &.disabled {
                    background-color: #8dd58a;
                    color: #dfefde;
                    border: 1px solid #8dd58a;
                }
                &:active {
                    border: 1px solid #40b93d;
                    background-color: #30a028;
                    color: #bbe4b0;
                }
            }
            .cancel {
                outline: none;
                background-color: #fff;
                border: 1px solid #cccccc;
                border-radius: 5px;
                color: #4c4c4c;
                &:active {
                    border: 1px solid #b7b7b7;
                    background-color: #e5e5e5;
                    color: #9898a1;
                }
            }
        }
    }
}
</style>
