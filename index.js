const WebSocket = require('ws')
const api = require('./api.js')
const ws = new WebSocket(process.env.CQServer)
Test()

function QQMessagePost(dataJson) {
    this.time = dataJson['time']
    this.self_id = dataJson['self_id']
    this.message_type = dataJson['message_type'];//消息类型(string):private,group
    this.sub_type = dataJson['sub_type'];//表示消息的子类型(string):group,public
    this.message_id = dataJson['message_id'];//消息ID(int32)
    this.user_id = dataJson['user_id'];//发送者QQ号(int64)
    this.message = dataJson['message'];
    this.raw_message = dataJson['raw_message'];
    this.sender = new QQSender(dataJson['sender'])
    //私聊
    if (this.message_type == 'private') { this.target_id = dataJson['target_id']; this.temp_source = dataJson['temp_source'] }
    //群聊
    if (this.message_type == 'group') { this.group_id = dataJson['group_id'] }
}
function QQSender(sender) {
    this.user_id = sender['user_id'];
    this.nickname = sender['nickname'];
    this.sex = sender['sex'];
    this.card = sender['card'];
    this.area = sender['area'];
    this.level = sender['level'];
    this.role = sender['role'];
    this.title = sender['title'];
}
function QQGroupInfo(data) {
    this.group_id = data['group_id'];
    this.group_name = data['group_name'];
    this.group_memo = data['group_memo'];
    this.group_create_time = data['group_create_time'];
    this.group_level = data['group_level'];
    this.group_count = data['group_count'];
    this.group_member_count = data['group_member_count'];
}
ws.on('open', function open() {
    console.log('Connect');
});

ws.on('close', function close() {
    console.log('disconnected');
});

ws.on('message', function message(data) {
    const DataJson = JSON.parse(data.toString());
    const DataPostType = DataJson['post_type'];

    if (DataPostType == 'meta_event') { return }//心跳
    switch (DataPostType) {//判断消息类型
        case 'message':
        case 'message_sent':
            const Message = new QQMessagePost(DataJson);
            switch (Message.message_type) {
                case 'group':
                    api.API_get_group_info(Message.group_id).then(result => {
                        const Groupinfo = new QQGroupInfo(result['data'])
                        console.info(`收到消息:来自群${Groupinfo.group_name}(${Groupinfo.group_id})的${Message.sender.nickname}(${Message.sender.user_id}):${Message.raw_message}`);
                        if (String(Message.raw_message).startsWith('[CQ:at,qq=3636990074] ')) {
                            const result = api.Mahiro_get_command_result(Message.raw_message);
                            api.API_send_group_msg(Message.group_id, result, false)
                        }

                    })
                    break;
                case 'private':
                    console.info(`收到消息:来自${Message.sender.nickname}(${Message.sender.user_id}):${Message.raw_message}`);
                    break;
            }
            break;
        case 'request':
            console.log(dataJson['request_type'])
    }
});

function Test(){

}