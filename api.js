const rp = require('request-promise');
const post_url = 'http://mc.skana.fun:5700'
function root_func(path, body) {
    const options = { method: 'POST', url: post_url + path, body: body, json: true };
    return (rp(options))
}
/**获取群信息
 * 终结点：/get_group_info
 * 提示: 如果机器人尚未加入群, group_create_time, group_level, max_member_count 和 member_count 将会为0
 * @param {number} group_id 群号
 * @param {boolean} no_cache 是否不使用缓存（使用缓存可能更新不及时, 但响应更快）
 */
function API_get_group_info(group_id, no_cache = false) {
    let body = { 'group_id': group_id, 'no_cache': no_cache }
    return root_func('/get_group_info', body)
}
/**发送消息
 * 终结点：/send_msg
 * @param {string} message_type 消息类型, 支持 private、group , 分别对应私聊、群组, 如不传入, 则根据传入的 *_id 参数判断 
 * @param {number} user_id 对方 QQ 号 ( 消息类型为 private 时需要 )
 * @param {number} group_id 群号 ( 消息类型为 group 时需要 )
 * @param {string} message 要发送的内容
 * @param {boolean} auto_escape 消息内容是否作为纯文本发送 ( 即不解析 CQ 码 ) , 只在 message 字段是字符串时有效
 * @returns {object}
 */
function API_send_msg(message_type, user_id, group_id, message, auto_escape = false) {
    let body = { 'message_type': message_type, 'message': message, 'auto_escape': auto_escape }
    message_type = 'private' ? body['user_id'] = user_id : body['group_id'] = group_id;
    return root_func('/send_msg', body)
}
/**发送私聊消息
 * 终结点：/send_private_msg
 * @param {number} user_id 对方 QQ 号
 * @param {number} group_id 主动发起临时会话时的来源群号(可选, 机器人本身必须是管理员/群主)
 * @param {string} message 要发送的内容
 * @param {boolean} auto_escape 消息内容是否作为纯文本发送 ( 即不解析 CQ 码 ) , 只在 message 字段是字符串时有效
 */
function API_send_private_msg(user_id, group_id, message, auto_escape = false) {
    let body = { 'user_id': user_id, 'group_id': group_id, 'message': message, 'auto_escape': auto_escape }
    return root_func('/send_private_msg', body)
}
/**发送群聊消息
 * /send_group_msg
 * @param {number} group_id 
 * @param {string} message 
 * @param {boolean} auto_escape 
 * @returns 
 */
function API_send_group_msg(group_id, message, auto_escape = false) {
    let body = { 'group_id': group_id, 'message': message, 'auto_escape': auto_escape }
    return root_func('/send_group_msg', body)
}

function Mahiro_get_command_result(message) {
    let command = String(message).slice('[CQ:at,qq=3636990074] '.length)
    command = command.trim()
    let args = command.split(' ')
    command = args[0]
    args.shift()
    switch (command) {
        case '#about':
            return `关于 Mahiro Project
开发人员: Skana
特别鸣谢:
-https://docs.go-cqhttp.org/
已实现功能:
-接收/发送消息`
        case '#echo':
            return args[0]
    }

}
module.exports = {
    Mahiro_get_command_result,
    API_get_group_info,
    API_send_msg,
    API_send_private_msg,
    API_send_group_msg
}