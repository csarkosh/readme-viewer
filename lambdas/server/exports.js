const fs = require('fs')

exports.handler = (event, context, callback) => {
    var response = {
        statusCode: 200,
        headers: {
            'Content-Type': 'text/html; charset=utf-8'
        },
        body: fs.readFileSync('./index.html').toString('utf-8')
    }
    callback(null, response)
}
