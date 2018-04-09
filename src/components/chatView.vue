<template>
    <div id="chatview">
        <div class="chatlist">
            <chat-list></chat-list>
        </div>
        <div class="main">
            <chat-info :isInfo.sync="isInfo"></chat-info>
            <message></message>
            <text-msg :isInfo.sync="isInfo"></text-msg>
        </div>
    </div>
</template>

<script>
import ChatList from '../components/chatView/chatList';
import ChatInfo from '../components/chatView/chatInfo';
import Message from '../components/chatView/message';
import TextMsg from '../components/chatView/textMsg';
export default {
    data() {
        return {
            isInfo: false
        };
    },
    components: {
        ChatList,
        ChatInfo,
        Message,
        TextMsg
    }
};
</script>


<style lang="scss" scoped>
#chatview {
    display: flex;
    width: 100%;
    height: 100%;
    .chatlist {
        width: 260px;
        height: 100%;
        background-color: #FFFFFF;
        border-right: 1px solid #dedede;
    }
    .main {
        width: 450px;
        height: 100%;
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        background-color: #FFFFFF;
    }
}
</style>
