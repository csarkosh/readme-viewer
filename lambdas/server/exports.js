const fs = require('fs')

exports.handler = (event, context, callback) => {
    var response = {
        statusCode: 200,
        headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Strict-Transport-Security': 'max-age=15768001; includeSubDomains',
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': 'sameorigin',
            'X-XSS-Protection': '1'
        },
        body: fs.readFileSync('./index.html').toString('utf-8')
    }
    callback(null, response)
}
