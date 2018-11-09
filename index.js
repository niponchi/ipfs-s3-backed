require('dotenv/config')

const Gateway = require('ipfs/src/http')
const Repo = require('ipfs-repo')
const { S3 } = require('aws-sdk')
const S3Store = require('datastore-s3')
const S3Lock = require('./s3-lock')

// Initialize the AWS S3 instance
const s3 = new S3({
  params: {
    Bucket: 'my-ipfs'
  },
  accessKeyId: process.env.AWS_ACCESSKEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESSKEY,
})

const bucketpath = '/'

// Create our custom lock
const s3Store = new S3Store(bucketpath, { s3 })
const s3Lock = new S3Lock(s3Store)

// Create the IPFS Repo, full backed by S3
const repo = new Repo(bucketpath, {
  storageBackends: {
    root: S3Store,
    blocks: S3Store,
    keys: S3Store,
    datastore: S3Store
  },
  storageBackendOptions: {
    root: { s3 },
    blocks: { s3 },
    keys: { s3 },
    datastore: { s3 }
  },
  lock: s3Lock
})

const gateway = new Gateway(
  repo,
  {
    "Addresses": {
      "Swarm": [
        "/ip4/0.0.0.0/tcp/4002",
        "/ip4/0.0.0.0/tcp/4003/ws"
      ],
      "API": "/ip4/0.0.0.0/tcp/5002",
      "Gateway": "/ip4/0.0.0.0/tcp/9090"
    }
  }
)

console.log('Starting the gateway...')

gateway.start(true, (x) => {

  if (x instanceof Error) {
    return console.error(x.message)
  }

  console.log('Gateway now running')

  const node = gateway.node

  node.version()
    .then((version) => {
      console.log('Version:', version.version)
    })
    // Once we have the version, let's add a file to IPFS
    .then(() => {
      return node.files.add({
        path: 'data.txt',
        content: Buffer.from(`js_ipfs ${Date.now()}`)
      })
    })
    // Log out the added files metadata and cat the file from IPFS
    .then((filesAdded) => {
      console.log('\nAdded file:', filesAdded[0].path, filesAdded[0].hash)
      return node.files.cat(filesAdded[0].hash)
    })
    // Print out the files contents to console
    .then((data) => {
      console.log(`\nFetched file content '${data.toString()}' containing ${data.byteLength} bytes`)
    })
    // Log out the error, if there is one
    .catch((err) => {
      console.log('File Processing Error:', err)
    })
})
