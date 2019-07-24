const aws = require('aws-sdk')
const axios = require('axios')


exports.handler = async () => {
    await new Promise((resolve, reject) => {
        (new aws.SecretsManager({ region: 'us-east-1' }))
            .getSecretValue({ SecretId: 'gh/read_token' }, (err, data) => {
                if (err !== null) {
                    reject(err)
                } else {
                    resolve(JSON.parse(data.SecretString).gh_read_token)
                }
            })
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
    })).then(({ data }) => new Promise((resolve, reject) => {
        if (data && data.data && data.data.user && data.data.user.repositories && data.data.user.repositories.edges && data.data.user.repositories.edges.length) {
            (new aws.S3()).upload({
                Body: JSON.stringify(data.data.user.repositories.edges.map(({ node }) => node)),
                Bucket: 'csarko.sh',
                Key: 'data/repos.json'
            }, err => {
                if (err !== null) {
                    reject(err)
                } else {
                    resolve()
                }
            })
        }
    }))
}
