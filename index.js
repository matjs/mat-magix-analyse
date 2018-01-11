const path = require('path')

/**
 * 分析js,打包view
 */
function analyse(combineTool) {
    return function* combine(next) {
        yield next
        let body = this.body.toString()
        if (body == 'Not Found') {
            throw new Error('路径：' + this.path + ' 对应的文件没有找到')
        }

        body = yield combineTool.processContent(path.join(process.cwd(), this.path), '', body)
        this.body = body.content;
    }
}

module.exports = analyse