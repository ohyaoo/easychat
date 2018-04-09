<template>
    <div id="text_msg" v-if="activeSession.type === 'user' || activeSession.type === 'group'" @click="handleInfo">
        <textarea v-focus name="" id="" placeholder="按Ctrl+Enter发送" v-model="content" @keydown="handleSend"></textarea>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
export default {
    props: ['isInfo'],
    data() {
        return {
            content: ''
        };
    },
    computed: {
        ...mapGetters(['activeSession', 'userInfo'])
    },
    methods: {
        ...mapActions(['sendMessage']),
        handleSend(e) {
            if (e.ctrlKey && e.keyCode === 13 && this.content.length) {
                let datemsg = new Date();
                let data;
                if (this.activeSession.type === 'user') {
                    data = {
                        msg: this.content,
                        type: 'user',
                        dateMsg: datemsg,
                        user: this.userInfo
                    };
                }
                if (this.activeSession.type === 'group') {
                    data = {
                        msg: this.content,
                        type: 'group',
                        dateMsg: datemsg,
                        user: this.userInfo,
                        group: this.activeSession.group
                    };
                }

                this.sendMessage(data);
                this.content = '';
            }
        },
        handleInfo() {
            this.$emit('update:isInfo', false);
        }
    },
    directives: {
        focus: {
            // 指令的定义
            update: function(el) {
                el.focus();
            },
            inserted: function(el) {
                el.focus();
            }
        }
    }
};
</script>

<style lang="scss" scoped>
#text_msg {
    height: 150px;
    width: 100%;
    textarea {
        box-sizing: border-box;
        background-color: #f3f3f3;
        width: 100%;
        height: 100%;
        border: 0px;
        outline: none;
        padding: 5px;
        font-size: 12px;
        line-height: 16px;
    }
}
</style>


