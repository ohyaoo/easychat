<template>
    <div id="infolist">
        <div class="search_add_box">
            <input type="text" class="search" placeholder="search user...">
            <button class="add" @click="handleModal">
                <span>+</span>
            </button>
        </div>
        <div class="list_box">
            <p class="list_name" @click="isContact = !isContact">联系人</p>
            <ul v-show="isContact">
                <li v-for="user in contacts" :class="{active:user === activeContact}" @click="selectContact(user.userid)">
                    <img src="../../../static/IMG_1472.jpg" alt="" class="useravatar">
                    <span class="username">{{user.username}}</span>
                </li>
            </ul>
            <p class="list_name" @click="isGroup = !isGroup">群聊</p>
            <ul v-show="isGroup">
                <li v-for="group in groups" :class="{active:group === activeContact}" @click="selectGroup(group.groupid)">
                    <img src="../../../static/IMG_1472.jpg" alt="" class="useravatar" >
                    <span class="username">{{group.groupname}}</span>
                </li>
            </ul>
        </div>
        <search-info :show.sync="isShow">
        </search-info>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import SearchInfo from './searchInfo';
export default {
    data() {
        return {
            isShow: false,
            isContact: true,
            isGroup: false
        };
    },
    computed: {
        ...mapGetters(['contacts', 'activeContact', 'groups'])
    },
    components: {
        SearchInfo
    },
    methods: {
        ...mapActions(['selectContact','selectGroup']),
        handleModal() {
            this.isShow = true;
        }
    }
};
</script>


<style lang="scss" scoped>
#infolist {
    height: 100%;
    display: flex;
    flex-direction: column;
    .search_add_box {
        -webkit-app-region: drag;
        width: 100%;
        height: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        .search {
            -webkit-app-region: no-drag;
            line-height: 20px;
            width: 189px;
            outline: none;
            border: 1px solid #d0d0d0;
            border-radius: 3px;
            background-color: #e1e1e1;
            padding: 0 5px;
        }
        .add {
            -webkit-app-region: no-drag;
            margin-left: 7px;
            padding: 0px;
            width: 24px;
            height: 22px;
            border: 1px solid #e5e5e5;
            background-color: #ffffff;
            border-radius: 3px;
            outline: none;
            span {
                width: 100%;
                height: 100%;
                display: inline-block;
                font-size: 16px;
                font-weight: 200;
            }
            &:active {
                background-color: #e1e1e1;
                border: 1px solid #d0d0d0;
            }
            transition: background-color 0.2s;
            transition: border 0.2s;
        }
    }
    .list_box {
        // height: 100%;
        // display: flex;
        // flex-direction: column;
        height: 450px;
        overflow: scroll;
        flex-grow: 1;
        .list_name {
            cursor: default;
            margin: 0px;
            font-size: 15px;
            padding-left: 15px;
            margin-bottom: 15px;
        }
        ul {
            padding: 0px;
            margin: 0px;
            li {
                list-style: none;
                height: 50px;
                padding-left: 35px;
                display: flex;
                align-items: center;
                cursor: default;
                .useravatar {
                    width: 30px;
                    height: 30px;
                    border-radius: 3px;
                }
                .username {
                    font-size: 17px;
                    padding: 15px;
                }
                &.active {
                    background-color: #e0e1e2;
                }
                transition: background-color 0.1s;
            }
        }
    }
}
</style>
