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
            .getSecretValue({ SecretId: 'gh/ro-user-repo' }, (err, data) => {
                if (err !== null) {
                    reject(err)
                } else {
                    let secretData = JSON.parse(data.SecretString);
                    const readToken = secretData['gh/ro-user-repo'];
                    resolve(readToken)
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
            const repos = []
            data.data.user.repositories.edges.forEach(({ node }) => {
                // Ignore profile Readme
                if (node.name !== 'csarkosh') {
                    repos.push(node)
                }
            })

            Promise.all(repos.map(({ name, url }) => new Promise(res => {
                axios.get(`${url}/blob/master/README.md`).then(({ data }) => {
                    const $ = cheerio.load(data)
                    const readme = $('#readme')

                    // Style readme
                    readme.prepend(`
                        <style>
                            article {
                                color: #24292e; 
                                font-family: -apple-system, Helvetica, Arial, sans-serif;
                                margin-top: 16px;
                                overflow-x: hidden;
                            }
                            a:not(.anchor) { color: #0366d6; }
                            a:not(:hover) {
                                text-decoration: none;
                            }
                            a.anchor {
                                display: none;
                            }
                            h1 {
                                border-bottom: solid 1px rgb(234, 236, 239);
                                font-size: 32px;
                                font-weight: 600;
                                overflow-wrap: break-word;
                            }
                            h2 {
                                border-bottom: solid 1px rgb(234, 236, 239);
                                font-size: 24px;
                                font-weight: 600;
                                line-height: 30px;
                                overflow-wrap: break-word;
                            }
                        </style>
                    `)

                    // Replace relative paths with absolute paths to github
                        readme
                            .find('img')
                            .filter((idx, el) => $(el).attr('src').match('^\/'))
                            .attr('src', (idx, val) => `https://github.com${val}`)

                    // Remove hyperlinking out-of readme
                    readme.find('a').attr('href', '#')

                    res({ name, readme: readme.html() })
                })
            }))).then(readmes => resolve({ repos, readmes }))
        }
    // Store GH data and READMEs in S3
    })).then(({ repos, readmes }) => Promise.all([
        uploadToS3('readme-viewer.csarko.sh', 'data/repos.json', JSON.stringify(repos)),
        ...readmes.map(({ name, readme }) => uploadToS3('readme-viewer.csarko.sh', `docs/readmes/${name}.html`, readme, { ContentType: 'text/html' }))
    ]))
}
