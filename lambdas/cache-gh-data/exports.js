const aws = require('aws-sdk')
const axios = require('axios')
const cheerio = require('cheerio')


const s3 = new aws.S3()
const uploadToS3 = (Bucket, Key, Body, opts = {}) => new Promise((res, rej) => {
    const { ContentType } = opts
    s3.upload({ Body, Bucket, Key, ContentType }, err => err !== null ? rej(err) : res())
})


exports.handler = async () => {
    // Get GH read-only token
    await new Promise((resolve, reject) => {
        (new aws.SecretsManager({ region: 'us-east-1' }))
            .getSecretValue({ SecretId: 'gh/read_token' }, (err, data) => {
                if (err !== null) {
                    reject(err)
                } else {
                    resolve(JSON.parse(data.SecretString).gh_read_token)
                }
            })
    // Query data on my repos
    }).then(token => axios.post(
        'https://api.github.com/graphql',
        {
            query: `query {
                user(login:"csarkosh") {
                    repositories(first:10, ownerAffiliations:[OWNER], privacy:PUBLIC) {
                        edges {
                            node {
                                description
                                isFork
                                name
                                nameWithOwner
                                url
                                parent {
                                    nameWithOwner
                                    url
                                }
                            }
                        }
                    }
                }
            }`
        },
        { headers: { Authorization: `bearer ${token}`}
    // Download my repos' READMEs
    })).then(({ data }) => new Promise((resolve) => {
        if (data && data.data && data.data.user && data.data.user.repositories && data.data.user.repositories.edges && data.data.user.repositories.edges.length) {
            const repos = data.data.user.repositories.edges.map(({ node }) => node)
            Promise.all(repos.map(({ name, url }) => new Promise(res => {
                axios.get(`${url}/blob/master/README.md`).then(({ data }) => {
                    const $ = cheerio.load(data)
                    res({ name, readme: $('#readme').html() })
                })
            }))).then(readmes => resolve({ repos, readmes }))
        }
    // Store GH data and READMEs in S3
    })).then(({ repos, readmes }) => Promise.all([
        uploadToS3('csarko.sh', 'data/repos.json', JSON.stringify(repos), { ContentType: 'text/html' }),
        ...readmes.map(({ name, readme }) => uploadToS3('csarko.sh', `docs/readmes/${name}.html`, readme))
    ]))
}
