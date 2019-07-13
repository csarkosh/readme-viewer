exports.handler = (event, context, callback) => {
    const response = event.Records[0].cf.response
    const headers = response.headers

    headers['x-frame-options'] = [{
        key: 'X-Frame-Options',
        value: 'sameorigin'
    }]

    headers['x-content-type-options'] = [{
        key: 'X-Content-Type-Options',
        value: 'nosniff'
    }]

    headers['strict-transport-security'] = [{
        key: 'Strict-Transport-Security',
        value: 'max-age=15768001; includeSubDomains'
    }]

    headers['content-security-policy'] = [{
        key: 'Content-Security-Policy',
        value: 'default-src \'self\' *.gstatic.com *.csarko.sh csarko.sh s3-us-west-2.amazonaws.com *.googleapis.com *.googletagmanager.com *.google-analytics.com; style-src \'unsafe-inline\' '
    }]

    headers['x-xss-protection'] = [{
        key: 'X-XSS-Protection',
        value: '1'
    }]

    callback(null, response)
}
