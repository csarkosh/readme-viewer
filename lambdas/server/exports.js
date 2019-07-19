const crypto = require('crypto')
const fs = require('fs')
const cheerio = require('cheerio')


exports.handler = (event, context, callback) => {
    const $ = cheerio.load(fs.readFileSync('./index.html').toString('utf-8'))
    const nonce = crypto.randomBytes(16).toString('base64')
    $('script').attr('integrity', `nonce-${nonce}`)
    $('style').attr('itegrity', `nonce-${nonce}`)
    $('meta[property="csp-nonce"]').attr('content', `nonce-${nonce}`)

    callback(null, {
        statusCode: 200,
        headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Strict-Transport-Security': 'max-age=15768001; includeSubDomains',
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': 'sameorigin',
            'X-XSS-Protection': '1'
        },
        body: $.html()
    })
}
