<template>
    <div id="infodetail">
        <div class="user" v-if="activeContact.userid">
            <div class="card_one">
                <p class="username">{{activeContact.username}}</p>
                <img src="/static/IMG_1472.jpg" alt="" class="useravatar">
            </div>
            <div class="card_two">
                <div class="userid_box">
                    <span class="userid_text">账&ensp;号</span>
                    <span class="userid_info">{{activeContact.userid}}</span>
                </div>
            </div>
            <div class="btn_box">
                <router-link to="/chatview">
                    <el-button type="success" @click="addChat(activeContact)" class="sendbtn">发消息</el-button>
                </router-link>
            </div>
            <div class="delete">
                <span @click="delContact(activeContact.userid)">从通讯录中删除</span>
            </div>
        </div>
        <div class="group" v-if="activeContact.groupid">
            <div class="group_card">
                <img src="/static/IMG_1472.jpg" alt="" class="groupavatar">
                <p class="groupname">{{activeContact.groupname}}</p>
            </div>
            <div class="group_btn">
                <router-link to="/chatview">
                    <el-button type="success" @click="addGroupChat(activeContact)" class="sendbtn">进入群聊</el-button>
                </router-link>
            </div>
            <div class="delete">
                <span @click="delGroup(activeContact.groupid)">从通讯录中删除</span>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
export default {
    computed: {
        ...mapGetters(['activeContact'])
    },
    methods: {
        ...mapActions(['addChat', 'addGroupChat','delContact','delGroup'])
    }
};
</script>

<style lang="scss" scoped>
#infodetail {
    height: 100%;
    .user {
        height: 100%;
        position: relative;
        .card_one {
            width: 60%;
            height: 80px;
            margin: 0px auto 0px;
            padding-top: 70px;
            padding-bottom: 20px;
            border-bottom: 1px solid #e6e6e6;
            position: relative;
            .username {
                margin: 0px;
                position: absolute;
                font-size: 28px;
                font-weight: 600;
            }
            .useravatar {
                width: 80px;
                height: 80px;
                border-radius: 2px;
                position: absolute;
                right: 0px;
                // bottom: 20px;
            }
        }
        .card_two {
            width: 60%;
            margin: 0px auto;
            margin-top: 35px;
            margin-bottom: 60px;
            .userid_text {
                color: #8e8884;
                font-size: 15px;
            }
            .userid_info {
                font-size: 15px;
                padding-left: 25px;
            }
        }
        .btn_box {
            text-align: center;
            .sendbtn {
                width: 130px;
                font-weight: 200;
            }
        }
        .delete {
            width: 100%;
            font-size: 15px;
            position: absolute;
            bottom: 35px;
            text-align: center;
            cursor: default;
            color: #576B95;
        }
    }
    .group {
        height: 100%;
        text-align: center;
        position: relative;
        .group_card {
            padding-top: 160px;
            img {
                width: 110px;
                height: 110px;
                border-radius: 2px;
            }
            p {
                font-size: 20px;
                font-weight: 500;
            }
            margin-bottom: 80px;
        }
        .group_btn {
            text-align: center;
            .sendbtn {
                width: 130px;
                font-weight: 200;
            }
        }
        .delete {
            width: 100%;
            font-size: 15px;
            position: absolute;
            bottom: 35px;
            cursor: default;
            color: #576B95;
        }
    }
}
</style>


