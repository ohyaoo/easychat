<template>
    <div id="list">
        <div class="search_box">
            <input class="search" placeholder="search session..." type="text">
            <button class="add_btn" @click="isShow = true">
                <span>+</span>
            </button>
        </div>
        <new-group class="new_group_box" :show.sync="isShow"></new-group>
        <ul class="chatlist">
            <li v-for="session in sessions" :class="{active:session === activeSession}" @click="selectSession(session)">
                <div v-if="session.type === 'user'">
                    <img src="../../../static/IMG_1472.jpg" alt="" class="avatar">
                    <p>{{session.user.username}}</p>
                    <span class="noread" v-if="session.noRead">{{session.noRead}}</span>
                </div>
                <div v-if="session.type === 'group'">
                    <img src="../../../static/IMG_1472.jpg" alt="" class="avatar">
                    <p>{{session.group.groupname}}</p>
                    <span class="noread" v-if="session.noRead">{{session.noRead}}</span>
                </div>
                <div v-if="session.type === 'system'">
                    <img src="/static/IMG_1472.jpg" alt="" class="avatar">
                    <p>{{session.system.name}}</p>
                    <!-- <span class="noread" v-if="session.noRead">{{session.noRead}}</span> -->
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
import NewGroup from './newGroup';
import { mapGetters } from 'vuex';
import { mapActions } from 'vuex';
export default {
    data() {
        return {
            isShow: false
        };
    },
    computed: {
        ...mapGetters(['sessions', 'activeSession'])
    },
    methods: {
        ...mapActions(['selectSession'])
    },
    components: {
        NewGroup
    }
};
</script>

<style lang="scss" scoped>
#list {
    .search_box {
        -webkit-app-region: drag;
        width: 100%;
        height: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        .search {
            -webkit-app-region: no-drag;
            width: 189px;
            line-height: 20px;
            border: 1px solid #d0d0d0;
            background-color: #e1e1e1;
            border-radius: 3px;
            padding: 0 5px;
            outline: none;
        }
        .add_btn {
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
    .chatlist {
        padding: 0;
        margin: 0;
        li {
            list-style: none;
            height: 70px;
            padding-left: 10px;
            border-bottom: 1px solid #e5e5e5;
            &.active {
                background-color: #e0e1e2;
            }
            transition: background-color 0.1s;
            div {
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                position: relative;
                .avatar {
                    width: 45px;
                    height: 45px;
                    border-radius: 3px;
                }
                p {
                    cursor: default;
                    margin: 0;
                    font-size: 16px;
                    color: #000;
                    padding-left: 20px;
                }
                .noread {
                    position: absolute;
                    right: 25px;
                    display: flex;
                    width: 20px;
                    height: 20px;
                    line-height: 20px;
                    font-size: 12px;
                    color: #fff;
                    border-radius: 20px;
                    background-color: #BDBDBD;
                    align-items: center;
                    justify-content: center;
                }
            }
        }
    }
}
</style>


