import Vue from 'vue';
import Vuex from 'vuex';
import mqtt from 'mqtt';
import axios from 'axios'
import util from '../utils/util'
Vue.use(Vuex);

/**
 * mqtt作为通信协议
 */
let mqttSettings = {
    keepalive: 20,
    reconnectPeriod: 2000,
    connectTimeout: 30 * 1000,
    host: '192.168.211.101',
    port: 1883,
    clean: false
}

/**
 * vuex状态管理
 * 在state中有user、sessions、activeSession，分别是存放登录用户信息、会话对象、当前会话
 * client是开启mqtt的客户端对象
 * contacts 存放好友列表
 * 
 * user对象包括userid、username、useravatar、flag
 * flag 0离线 1在线
 * 
 * sessions数组里每个对象包括uesr对象、message数组、type或（group对象、message数组、type）noRead
 * type类型有user、group
 * message数组包括msg、type、dateMsg或（msg、type、dateMsg、user）
 * activeSession为sessions数组中一个对象
 * contacts数组包括多个user对象
 * activeContact为contacts数组中一个对象
 * groups数组包括多个group对象
 * 
 * group对象包括groupid、groupname、groupuser、groupavatar
 * 
 */
const state = {
    user: {},
    client: {},
    sessions: [],
    activeSession: {},
    contacts: [],
    activeContact: {},
    groups: [],
    view: 0
};

/**
 * userlist 聊天成员，包括当前用户
 */

const getters = {
    userInfo: state => state.user,
    sessions: state => state.sessions,
    activeSession: state => state.activeSession,
    contacts: state => state.contacts,
    activeContact: state => state.activeContact,
    view: state => state.view,
    userList: state => {
        let userList = [];
        if (state.activeSession.type === 'user') {
            userList.push(state.user);
            userList.push(state.activeSession.user);
        }
        if (state.activeSession.type === 'group') {
            userList = userList.concat(state.activeSession.group.groupuser);
        }
        return userList;
    },
    groups: state => state.groups
};

const mutations = {
    /**
     * login_user登录初始化,
     * user参数为当前登录用户信息,导入state.sessions,默认activeSession为session第一条
     * 打开mqtt客户端
     */
    login_user(state, user) {
        state.user.userid = user.userid;
        state.user.username = user.username;
        state.user.useravatar = user.image_herf;
        state.user.flag = user.flag;
        mqttSettings.clientId = user.userid;
        state.client = mqtt.connect(mqttSettings);
    },

    /**
     * select_session在chatList界面实现
     * select_session改变state.activeSession
     * @param {*} userid 聊天用户的id，sessions内各对象唯一标识
     * 
     */
    select_session(state, session) {
        let one = [];
        if (session.type === 'user') {
            one = state.sessions.filter(function(i_session, index) {
                if (i_session.type === 'user') {
                    state.sessions[index].noRead = 0;
                    return i_session.user === session.user
                }
            })
        }
        if (session.type === 'group') {
            one = state.sessions.filter(function(i_session, index) {
                if (i_session.type === 'group') {
                    state.sessions[index].noRead = 0;
                    return i_session.group === session.group
                }
            })
        }
        if (session.type === 'system') {
            one = state.sessions.filter(function(i_session, index) {
                return i_session.type === session.type;
            })
        }
        state.activeSession = one[0];
    },

    /**
     * init_message初始化当前聊天对象的聊天记录
     * 在登录时调用 
     */
    init_message(state) {
        /**
         * qos消息质量，设置离线消息
         * user/id 监听好友发送消息
         * id 监听系统发消息
         * online 监听系统通知上线消息
         */
        state.client.subscribe('user/' + state.user.userid, { qos: 1 })
        state.client.subscribe(state.user.userid, { qos: 1 });
        state.client.subscribe('online');
        for (let session of state.sessions) {
            if (session.type === 'user') {
                axios.post(
                    '/chatting/chatting_select', {
                        userid: state.user.userid,
                        othersid: session.user.userid
                    }
                ).then(function(res) {
                    if (res.data.message) {
                        let messages = res.data.message;
                        for (let i = 0; i < messages.length; i++) {
                            messages[i].dateMsg = util.initDate(messages[i]);
                        }
                        session.message = messages;
                    }
                }).catch(function(err) {
                    console.log(err)
                })
            }
            if (session.type === 'group') {
                axios.post(
                    '/chatting/chatting_select_group', {
                        userid: state.user.userid,
                        groupid: session.user.groupid
                    }
                ).then(function(res) {
                    console.log(res)
                }).catch(function(err) {
                    console.log(err)
                })
            }
        }
    },
    /**
     * 用在textMsg组件里，对textarea文本内容进行操作，添入state.sessions.message
     * @param {*} state 
     * @param {*} data 聊天内容信息
     */
    send_message(state, data) {
        /**
         * 处理数据，添加发布者id，订阅者接收
         * new_data为deal_data对象转化成的字符串
         */
        // let deal_data = data;
        let new_data = JSON.stringify(data);
        let topic;

        if (state.activeSession.type === 'user') {
            topic = 'user/' + state.activeSession.user.userid;
        }

        if (state.activeSession.type === 'group') {
            topic = 'group/' + state.activeSession.group.groupid;
        }

        state.client.publish(topic, new_data, { qos: 1 });

        let pre_message = state.activeSession.message.slice(-1);
        let deal_data = util.messageDate(data, pre_message);
        let deal_new_data = {};
        if (deal_data.type === 'user') {
            deal_new_data = {
                msg: deal_data.msg,
                type: 'send',
                dateMsg: deal_data.dateMsg,
                unModifiedDate: deal_data.unModifiedDate
            }
        }
        if (deal_data.type === 'group') {
            deal_new_data = {
                msg: deal_data.msg,
                type: 'send',
                dateMsg: deal_data.dateMsg,
                unModifiedDate: deal_data.unModifiedDate,
                user: deal_data.user
            }
        }
        state.activeSession.message.push(deal_new_data);
    },
    receive_message(state) {
        state.client.on('message', function(topic, message) {
            if (topic.includes('user')) {
                if (topic.substring(5) === state.user.userid) {
                    let data = JSON.parse(message.toString());
                    /**
                     * 处理时间戳格式
                     */
                    let session = state.sessions.filter(function(session) {
                        if (session.type === 'user') {
                            return session.user.userid === data.user.userid;
                        }
                    })
                    let pre_message = [];
                    if (session.length) {
                        pre_message = session[0].message.slice(-1);
                    }
                    let deal_data = util.messageDate(data, pre_message);

                    let new_data = {
                        msg: deal_data.msg,
                        type: 'receive',
                        dateMsg: deal_data.dateMsg,
                        unModifiedDate: deal_data.unModifiedDate
                    };
                    let index = 0;
                    let one = state.sessions.filter(function(session, i) {
                        if (session.type === 'user') {
                            if (session.user.userid === data.user.userid) {
                                index = i;
                            }
                            return session.user.userid === data.user.userid
                        }
                        /**
                         * 可以在这里对比好友的username是否改变
                         */
                    });
                    if (one.length) {
                        if (state.activeSession.type && state.activeSession.user.userid === state.sessions[index].user.userid) {
                            state.sessions[index].message.push(new_data);
                        } else {
                            one[0].message.push(new_data);
                            one[0].noRead++;
                            state.sessions.splice(index, 1);
                            state.sessions.unshift(one[0]);
                        }
                        /**
                         * 判断activeSession是否存在
                         * 不存在则将one[0]放入
                         */
                        if (!state.activeSession.type) {
                            state.sessions[0].noRead = 0;
                            state.activeSession = state.sessions[0];
                        }
                    } else {
                        let new_one = {
                            user: data.user,
                            message: [new_data],
                            type: 'user',
                            noRead: 1
                        }
                        state.sessions.unshift(new_one);
                        if (!state.activeSession.type) {
                            state.sessions[0].noRead = 0;
                            state.activeSession = new_one;
                        }
                    }
                }
            }
            if (topic === 'online') {
                let index = 0;
                let new_message = JSON.parse(message.toString());
                let one = state.contacts.filter(function(contact, i) {
                    if (contact.userid === new_message.id) {
                        index = i;
                    }
                    return contact.userid === new_message.id
                });
                if (one[0]) {
                    state.contacts[index].flag = new_message.status;
                    state.sessions.filter(function(session, i) {
                        if (session.type === 'user') {
                            if (session.user.userid === one[0].userid) {
                                state.sessions[i].user = one[0];
                            }
                            return session.user.userid === one[0].userid;
                        }
                    })
                }
            }
            if (topic === state.user.userid) {
                if (message.toString()) {
                    let new_message = JSON.parse(message.toString());
                    if (new_message.type === 'group') {
                        state.client.subscribe('group/' + new_message.groupid);
                    } else if (new_message.type === 'no_user') {
                        let one = state.sessions.filter(function(session, index) {
                            if (session.type === 'system') {
                                let temp_message = {
                                    dateMsg: new Date(new_message.user.time)
                                }
                                new_message.user.time = util.initDate(temp_message).dateMsg;
                                state.sessions[index].message.push(new_message.user);
                                if (state.activeSession.type !== 'system') {
                                    state.sessions[index].noRead++;
                                    let new_session = state.sessions[index];
                                    state.sessions.splice(index, 1);
                                    state.sessions.unshift(new_session);
                                }
                                if (!state.activeSession.type) {
                                    state.sessions[0].noRead = 0;
                                    state.activeSession = state.sessions[0];
                                }
                                return session.type === 'system';
                            }
                        })
                        if (!one.length) {
                            let new_session = {
                                type: 'system',
                                system: {
                                    name: '好友验证消息',
                                    avatar: '/static/IMG_1472.jpg'
                                },
                                message: [new_message.user],
                                noRead: 1
                            };
                            state.sessions.unshift(new_session);
                            if (!state.activeSession.type) {
                                state.sessions[0].noRead = 0;
                                state.activeSession = new_session;
                            }
                        }
                    } else if (new_message.type === 'user') {
                        if (new_message.msg === 'true') {
                            let new_user = {
                                userid: new_message.user.userid,
                                username: new_message.user.username,
                                useravatar: new_message.user.image_herf,
                                flag: new_message.user.flag
                            }
                            state.contacts.push(new_user);
                        }
                    } else if (new_message.type === 'friends_delete') {
                        state.contacts = state.contacts.filter(contact => contact.userid !== new_message.userid)
                        if (state.activeContact.userid === new_message.userid) {
                            if (state.contacts.length) {
                                state.activeContact = state.contacts[0]
                            } else {
                                state.activeContact = {}
                            }
                        }
                        state.sessions = state.sessions.filter(session => {
                            if (session.type === 'user') {
                                return session.user.userid !== new_message.userid
                            } else {
                                return true
                            }
                        })
                        if (state.activeSession.type === 'user') {
                            if (new_message.userid === state.activeSession.user.userid) {
                                if (state.sessions.length) {
                                    state.activeSession = state.sessions[0]
                                } else {
                                    state.activeSession = {}
                                }
                            }
                        }
                    }
                }
            }
            if (topic.includes('group')) {
                let data = JSON.parse(message.toString());
                if (data.user.userid !== state.user.userid) {
                    /**
                     * 处理时间戳格式
                     */
                    let session = state.sessions.filter(function(session) {
                        if (session.type === 'group') {
                            return session.group.groupid === data.group.groupid;
                        }
                    })

                    let pre_message = [];
                    if (session.length) {
                        pre_message = session[0].message.slice(-1);
                    }
                    let deal_data = util.messageDate(data, pre_message);

                    let new_data = {
                        msg: deal_data.msg,
                        type: 'receive',
                        dateMsg: deal_data.dateMsg,
                        user: deal_data.user,
                        unModifiedDate: deal_data.unModifiedDate
                    }
                    let _session = state.sessions.filter(function(session, index) {
                        if (session.type === 'group') {
                            if (session.group.groupid === data.group.groupid) {
                                if (state.activeSession.type && state.activeSession.group.groupid === data.group.groupid) {
                                    state.sessions[index].message.push(new_data);
                                } else {
                                    state.sessions[index].noRead++;
                                    state.sessions[index].message.push(new_data);

                                    let one = state.sessions[index];
                                    state.sessions.splice(index, 1);
                                    state.sessions.unshift(one);
                                }
                                if (!state.activeSession.type) {
                                    state.sessions[0].noRead = 0;
                                    state.activeSession = state.sessions[0];
                                }
                            }
                            return session.group.groupid === data.group.groupid;
                        }
                    });
                    if (!_session.length) {
                        let groupuser = data.group.groupuser.filter(function(user) {
                            return user.userid !== state.user.userid
                        })
                        groupuser.unshift(state.user);
                        let group = {
                            groupid: data.group.groupid,
                            groupname: data.group.groupname,
                            groupavatar: data.group.groupavatar,
                            groupuser: groupuser
                        }
                        state.groups.push(group);
                        let one = {
                            group: group,
                            message: [new_data],
                            type: 'group',
                            noRead: 1
                        }
                        state.sessions.unshift(one);
                        if (!state.activeSession.type) {
                            state.sessions[0].noRead = 0;
                            state.activeSession = state.sessions[0];
                        }
                    }
                }
            }
        })
    },
    /**
     * 初始化contacts数组，从数据库获取数据
     * @param {*} state 
     */
    init_contacts(state) {
        axios.post(
            'firends/firends_list', {
                userid: state.user.userid
            }
        ).then(function(res) {
            if (res.data.length > 0) {
                for (let data of res.data) {
                    let contact = {
                        userid: data.firends_id,
                        username: data.username,
                        useravatar: data.image_herf,
                        flag: data.flag
                    }
                    state.contacts.push(contact);
                }
            }
        }).catch(function(err) {
            console.log(err);
        })
    },

    init_groups(state) {
        axios.post(
            '/group/group_user_list', {
                userid: state.user.userid
            }
        ).then(function(res) {
            if (res.data.length > 0) {
                for (let data of res.data) {
                    let group = {
                        groupid: data.groupid,
                        groupname: data.groupname,
                        groupavatar: data.groupImage,
                        groupuser: data.userList
                    }
                    state.groups.push(group);
                }
            }
        })
    },
    /**
     * 添加联系人，先判断contact是否存在
     * @param {*} state 
     * @param {*} user 联系人信息，userid、username、useravatar
     */
    add_contact(state, user) {
        let contact = state.contacts.filter(function(one) {
            return one.userid === user.userid
        });
        if (!contact.length) {
            axios.post(
                '/firends/firends_add', {
                    userid: state.user.userid,
                    username: state.user.username,
                    image_herf: state.user.useravatar,
                    firends_id: user.userid,
                    flag: state.user.flag
                }
            ).then(function(res) {
                // let new_user = {
                //     userid: user.userid,
                //     username: user.username,
                //     useravatar: user.image_herf,
                //     flag: user.flag
                // }
                // state.contacts.push(new_user);
                console.log(state.contacts)
            }).catch(function(err) {
                console.log(err)
            })
        }
    },
    add_contact_agree(state, user) {
        axios.post('/firends/firends_save', {
            msg: 'true',
            clientid: user.userid,
            userid: state.user.userid,
            username: state.user.username,
            image_herf: state.user.useravatar
        }).then(function(res) {
            let new_user = {
                userid: user.userid,
                username: user.username,
                useravatar: user.image_herf,
                flag: user.flag
            }
            state.contacts.push(new_user);
        }).catch(function(err) {
            console.log(err);
        });
    },
    /**
     * 选择联系人
     * @param {*} state 
     * @param {*} userid 联系人id
     */
    select_contact(state, userid) {
        let one = state.contacts.filter(function(contact) {
            return contact.userid === userid
        });
        state.activeContact = one[0];
    },
    select_group(state, groupid) {
        let one = state.groups.filter(function(group) {
            return group.groupid === groupid
        });
        state.activeContact = one[0];
    },

    /**
     * 
     * sidebar界面选择路由
     * flag：0 聊天界面
     * flag：1 信息界面
     */
    select_view(state, flag) {
        state.view = flag;
    },
    /**
     * 点击infoDetail界面的按钮，将当前activeContact联系人
     * 点击newGroup界面的按钮，如果选择仅有一个联系人
     * 加入聊天列表
     * @param {*} state 
     */
    add_chat(state, contact) {
        state.view = 0;
        let index = 0;
        let one = state.sessions.filter((session, i) => {
            if (session.type === 'user') {
                if (session.user.userid === contact.userid) {
                    index = i
                }
                return session.user.userid === contact.userid
            }
        });
        if (one[0]) {
            state.sessions.splice(index, 1);
            state.sessions.unshift(one[0]);
            state.activeSession = one[0]
        } else {
            let new_one = {
                user: contact,
                message: [],
                type: 'user',
                noRead: 0
            }
            state.sessions.unshift(new_one);
            state.activeSession = new_one;
        }
    },
    /**
     * 点击newGroup界面的按钮，如果选择有两个及以上联系人
     * 加入聊天列表
     * 处理contacts数据，将userid放入userlist传给服务器
     */
    add_group(state, contacts) {
        let userlist = [state.user.userid];
        for (let contact of contacts) {
            userlist.push(contact.userid)
        }
        let new_userlist = JSON.stringify(userlist);
        let groupname = state.user.username + '、' + contacts[0].username + '、' + contacts[1].username;
        let groupdate = new Date();

        axios.post(
            '/group/group_build', {
                userlist: new_userlist,
                groupname: groupname,
                groupdate: groupdate
            }
        ).then(function(res) {
            contacts.unshift(state.user)
            let group = {
                groupid: res.data + '',
                groupname: groupname,
                groupavatar: '',
                groupuser: contacts
            }
            state.groups.push(group);
            let session = {
                group: group,
                message: [],
                type: 'group',
                noRead: 0
            }
            state.sessions.unshift(session);
            state.activeSession = session;
        }).catch(function(err) {
            console.log(err);
        })
    },
    /**
     * 点击infoDetail界面发送消息按钮
     * @param {*} state 
     * @param {*} group 
     */
    add_group_chat(state, group) {
        state.view = 0;
        let index = 0;
        let one = state.sessions.filter((session, i) => {
            if (session.type === 'group') {
                if (session.group.groupid === group.groupid) {
                    index = i
                }
                return session.group.groupid === group.groupid
            }
        });
        if (one[0]) {
            state.sessions.splice(index, 1);
            state.sessions.unshift(one[0]);
            state.activeSession = one[0]
        } else {
            let new_one = {
                group: group,
                message: [],
                type: 'group',
                noRead: 0
            }
            state.sessions.unshift(new_one);
            state.activeSession = new_one;
        }
    },
    /**
     * 删除联系人
     */
    del_contact(state, userid) {
        axios.post(
            'firends/firends_delect', {
                userid: state.user.userid,
                firends_id: userid
            }
        ).then(function(res) {
            state.contacts = state.contacts.filter(function(contact) {
                return contact.userid !== userid
            });
            if (state.contacts.length) {
                state.activeContact = state.contacts[0];
            } else {
                state.activeContact = {}
            }
            state.sessions = state.sessions.filter(session => {
                if (session.type === 'user') {
                    return session.user.userid !== userid
                } else {
                    return true
                }
            })
            if (state.activeSession.type === 'user') {
                if (userid === state.activeSession.user.userid) {
                    if (state.sessions.length) {
                        state.activeSession = state.sessions[0]
                    } else {
                        state.activeSession = {}
                    }
                }
            }
        }).catch(function(err) {
            console.log(err);
        })
    },
    /**
     * 退出群聊
     * @param {*} state 
     * @param {*} groupid 
     */
    del_group(state, groupid) {
        axios.post(
            '/group/group_user_delete', {
                userid: state.user.userid,
                groupid: groupid
            }
        ).then(function(res) {
            state.groups = state.groups.filter(function(group) {
                return group.groupid !== groupid;
            });
            if (state.groups.length) {
                state.activeContact = state.groups[0];
            } else if (state.contacts.length) {
                state.activeContact = state.contacts[0];
            } else {
                state.activeContact = {};
            }
            state.sessions = state.sessions.filter(function(session) {
                if (session.type === 'group') {
                    return session.group.groupid !== groupid
                }
            })
            if (state.activeSession.type === 'group' && state.activeSession.group.groupid === groupid) {
                state.activeSession = state.sessions[0];
            }

        }).catch(function(err) {
            contacts.log(err);
        })

    }
}

const actions = {
    loginUser({ commit }, user) {
        commit('login_user', user)
    },
    selectSession({ commit }, data) {
        commit('select_session', data)
    },
    initMessage({ commit }) {
        commit('init_message')
    },
    sendMessage({ commit }, data) {
        commit('send_message', data)
    },
    receiveMessage({ commit }) {
        commit('receive_message')
    },
    initContacts({ commit }) {
        commit('init_contacts')
    },
    initGroups({ commit }) {
        commit('init_groups')
    },
    addContact({ commit }, user) {
        commit('add_contact', user)
    },
    addContactAgree({ commit }, userid) {
        commit('add_contact_agree', userid)
    },
    selectContact({ commit }, userid) {
        commit('select_contact', userid)
    },
    selectGroup({ commit }, groupid) {
        commit('select_group', groupid)
    },
    selectView({ commit }, flag) {
        commit('select_view', flag)
    },
    addChat({ commit }, contact) {
        commit('add_chat', contact)
    },
    addGroup({ commit }, contacts) {
        commit('add_group', contacts)
    },
    addGroupChat({ commit }, group) {
        commit('add_group_chat', group)
    },
    delContact({ commit }, userid) {
        commit('del_contact', userid)
    },
    delGroup({ commit }, groupid) {
        commit('del_group', groupid)
    }
}

export default new Vuex.Store({
    state,
    getters,
    mutations,
    actions
})