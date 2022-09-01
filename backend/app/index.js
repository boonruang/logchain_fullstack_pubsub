const express = require('express')
const cors = require('cors')
const request = require('request')
const Blockchain = require('../blockchain')
const PubSub = require('./pubsub')
// const P2pServer = require('./p2p-server')
// const BlockSystem = require('./blocksystem')
// const SERVER_IP = process.env.SERVER_IP || '192.168.7.55'
// const HTTP_PORT = process.env.HTTP_PORT || 3001
// const P2P_PORT = process.env.P2P_PORT || 5001
// let nodename = process.env.NODE_NAME || 'NODE1'
// const NODE_NAME = nodename.trim()

const app = express()

const blockchain = new Blockchain()
// global.p2pServer = new P2pServer(bc)

const pubsub = new PubSub({ blockchain })
global.globalVariable = { blockchain,pubsub }

// setTimeout(() => pubsub.broadcastChain(), 1000)

const DEFAULT_PORT = 3000
const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`


app.use(cors())

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

const role = require('../models/role')
const user = require('../models/user')

user.belongsTo(role)


app.use('/api/v2/system', require('./api_system'))
app.use('/api/v2/blockchain', require('./api_blockchain'))
app.use('/api/v2/user', require('./api_user'))
app.use('/api/v2/auth', require('./api_auth'))
app.use('/api/v2/role', require('./api_role'))

const syncChains = () => {
    request(
      { url: `${ROOT_NODE_ADDRESS}/api/blocks` },
      (error, response, body) => {
        if (!error && response.statusCode === 200) {
          const rootChain = JSON.parse(body)
  
          console.log('replace chain on a sync with', rootChain)
          blockchain.replaceChain(rootChain)
        }
      },
    )
  }
  
  
let PEER_PORT

if (process.env.GENERATE_PEER_PORT === 'true') {
    PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000)
} else if (process.env.GENERATE_PEER_PORT === 'false') {
   PEER_PORT = 3001
}
 
const PORT = PEER_PORT || DEFAULT_PORT
  app.listen(PORT, () => {
  console.log('\x1b[36m%s\x1b[0m',`listening on port:${PORT}`)

  syncChains()
})