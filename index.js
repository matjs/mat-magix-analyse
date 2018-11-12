const path = require('path')
const WebSocket = require('ws')

/**
 * 分析js,打包view
 */
function analyse(combineTool, ws) {
    return function* combine(next) {
        yield next
        let body = this.body.toString()
        if (body == 'Not Found') {
            throw new Error('路径：' + this.path + ' 对应的文件没有找到')
        }

        try {
            body = yield combineTool.processContent(path.join(process.cwd(), this.path), '', body)
        } catch (err) {
            //多窗口多客户端同时发送信息
            ws.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({
                        message: err.message,
                        type: 'error'
                    }));
                }
            })
        }


        this.body = body.content;
    }
}

module.exports = analyse