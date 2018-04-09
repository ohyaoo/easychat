function dealDate(dateMsg) {
    let hour = dateMsg.getHours();
    let minute = dateMsg.getMinutes();
    hour = hour > 9 ? hour : '0' + hour;
    minute = minute > 9 ? minute : '0' + minute;
    let datemsg = hour + ':' + minute;
    return datemsg;
}

/**
 * 
 * @param {*} current 当前信息
 * @param {*} pre_message 上一条信息,数组
 */
function messageDate(current, pre_message) {
    /**
     * unModifiedDate为准确时间
     * dateMsg为显示格式
     */
    current.dateMsg = new Date(current.dateMsg)
    current.unModifiedDate = current.dateMsg;
    /**
     * 处理时间戳格式
     */
    let datemsg = dealDate(current.dateMsg);

    if (pre_message.length) {
        let pre_time = pre_message[0].unModifiedDate.getTime();
        let current_time = current.dateMsg.getTime();
        if (current_time - pre_time < 90000) {
            current.dateMsg = '';
        } else {
            current.dateMsg = datemsg;
        }
    } else {
        current.dateMsg = datemsg;
    }
    return current;
}

/**
 * 
 * @param {*} message 所有信息
 */
function initDate(message) {
    /**
     * unModifiedDate为准确时间
     * dateMsg为显示格式
     */
    message.unModifiedDate = message.dateMsg;

    let current_time = new Date();

    let datemsg = dealDate(message.dateMsg);

    if (current_time.getTime() - message.unModifiedDate.getTime() < 604800000) {
        if (current_time.getDay() === message.unModifiedDate.getDay()) {
            message.dateMsg = datemsg;
        } else if (current_time.getDay() - message.unModifiedDate.getDay() === 1 && current_time.getDay() - unModifiedDate.getDay() === -6) {
            message.dateMsg = '昨天 ' + datemsg;
        } else {
            switch (message.unModifiedDate.getDay()) {
                case 0:
                    message.dateMsg = '星期日 ' + datemsg;;
                    break;
                case 1:
                    message.dateMsg = '星期一 ' + datemsg;;
                    break;
                case 2:
                    message.dateMsg = '星期二 ' + datemsg;;
                    break;
                case 3:
                    message.dateMsg = '星期三 ' + datemsg;;
                    break;
                case 4:
                    message.dateMsg = '星期四 ' + datemsg;;
                    break;
                case 5:
                    message.dateMsg = '星期五 ' + datemsg;;
                    break;
                case 6:
                    message.dateMsg = '星期六 ' + datemsg;;
                    break;
            }
        }
    } else {
        let year = message.unModifiedDate.getFullYear();
        let month = message.unModifiedDate.getMonth() + 1;
        let day = message.unModifiedDate.getDate();
        message.dateMsg = year + '年' + month + '月' + day + '日 ' + datemsg;
    }
    return message;
}

module.exports = {
    messageDate: messageDate,
    initDate: initDate
}