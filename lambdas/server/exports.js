const crypto = require('crypto')
const fs = require('fs')
const cheerio = require('cheerio')


exports.handler = (event, context, callback) => {
    const $ = cheerio.load(fs.readFileSync('./index.html').toString('utf-8'))
    const nonce = crypto.randomBytes(16).toString('base64')
    $('script').attr('nonce', nonce)
    $('style').attr('nonce', nonce)
    $('meta[property="csp-nonce"]').attr('content', nonce)

    callback(null, {
        statusCode: 200,
        headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Content-Security-Policy': `default-src 'none'; script-src 'self' 'nonce-${nonce}' *.google-analytics.com *.googletagmanager.com; style-src 'self' 'nonce-${nonce}' *.googleapis.com; font-src 'self' *.gstatic.com; img-src 'self' *.google-analytics.com *.googletagmanager.com github.blog; form-action 'self'; base-uri 'self'; frame-ancestors 'self'; manifest-src 'self'; connect-src 'self'; object-src 'self'; frame-src 'self'`,
            'Content-Type': 'text/html; charset=utf-8',
            'Expires': '0',
            'Pragma': 'no-cache',
            'Strict-Transport-Security': 'max-age=31536001; includeSubDomains',
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': 'sameorigin',
            'X-XSS-Protection': '1'
        },
        body: $.html()
    })
}
