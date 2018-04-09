<template>
    <div id="searchinfo" v-show="show">
        <div class="search">
            <p class="title">添加联系人</p>
            <span class="note">通过账号查找联系人</span>
            <div class="search_box">
                <input type="text" name="" class="search_text" v-model="userid">
                <button class="search_btn" @click="handleSearch"></button>
            </div>
            <div class="line"></div>
        </div>
        <div class="info" v-if="user.userid">
            <div class="user_info">
                <img src="../../../static/IMG_1472.jpg" alt="" class="useravatar">
                <span class="username">{{user.username}}({{user.userid}})</span>
                <el-button type="success" class="add_btn" @click="henaleAdd">添加</el-button>
            </div>
        </div>
    </div>
</template>
<script>
import 'vue-popup-mixin/dist/VuePopupMixin.css';
import Popup from 'vue-popup-mixin';
import {mapActions} from 'vuex'

export default {
    data() {
        return {
            userid: '',
            user: {}
        };
    },
    mixins: [Popup],
    methods: {
        ...mapActions(['addContact']),
        // 响应 overlay事件
        overlayClick() {
            this.userid = '';
            this.user = {};
            this.$emit('update:show', false);
        },
        // 响应 esc 按键事件
        escPress() {
            this.userid = '';
            this.user = {};
            this.$emit('update:show', false);
        },
        handleSearch: function() {
            let vm = this;
            this.axios
                .post(
                   '/firends/firends_search',
                    {
                        userid: vm.userid
                    }
                )
                .then(function(res) {
                    vm.user = res.data;
                })
                .catch(function(err) {
                    console.log(err);
                });
        },
        henaleAdd() {
            this.addContact(this.user);
            this.userid = '';
            this.user = {};
            this.$emit('update:show', false);
        }
    }
};
</script>

<style lang="scss" scoped>
#searchinfo {
    left: 50%;
    top: 100px;
    transform: translateX(-50%);
    position: fixed;
    width: 300px;
    background: #fff;
    border-radius: 8px;
    .search {
        text-align: center;
        height: 100%;
        .title {
            font-size: 20px;
            margin: 15px 0px 0px;
        }
        .note {
            display: inline-block;
            position: relative;
            margin-top: 15px;
            font-size: 13px;
            margin-bottom: 5px;
            left: -76px;
        }
        .search_box {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 20px;
            .search_text {
                outline: none;
                line-height: 20px;
                border: 1px solid #d0d0d0;
                border-radius: 3px;
                background-color: #e1e1e1;
                padding: 0 5px;
                width: 230px;
            }
            .search_btn {
                height: 22px;
                width: 24px;
                outline: none;
                background: url('../../../static/searchinfo_search.png');
                background-repeat: no-repeat;
                background-size: 12px 12px;
                background-position: 50% 50%;
                border: 1px solid #e5e5e5;
                border-radius: 3px;
                margin-left: 7px;
                padding: 0px;
                &:active {
                    background-color: #e1e1e1;
                    border: 1px solid #d0d0d0;
                }
                transition: background-color 0.2s;
                transition: border 0.2s;
            }
        }
        .line {
            width: 270px;
            height: 1px;
            background-color: #e5e5e5;
            margin: 10px auto;
        }
    }
    .info {
        margin-bottom: 15px;
        .user_info {
            height: 45px;
            transition: height 2s;
            margin-top: 10px;
            position: relative;
            .useravatar {
                height: 45px;
                width: 45px;
                border-radius: 3px;
                margin-left: 15px;
            }
            .username {
                position: absolute;
                margin-left: 10px;
                font-size: 15px;
            }
            .add_btn {
                position: absolute;
                width: 65px;
                height: 26px;
                font-size: 11px;
                bottom: 0px;
                right: 15px;
                padding: 0;
            }
        }
    }
}
</style>