const Block = require('./block')
const bcModel = require('../models/blockchain')

class Blockchain {
  constructor() {

    // if (process.env.API_SERVER === 'true') {
    //   this.chain = this.init()
    // } else {
    //   this.chain = [Block.genesis()]
    // }
 
    this.chain = this.init()

    // setTimeout(() => {
    //   console.log('this.chain in constructor: ', this.chain)
    // }, 500)
  }

  async init() {
    
    // blockchain.sync()
    let blockCount = await bcModel.count()
    if (blockCount < 1) {
      this.chain = [Block.genesis()]
    } else {
      this.chain = await this.readData()
    }
    // setTimeout(() => {
    //   this.writeDB()
    // }, 1000)
    // this.writeDB(this.chain)
    return this.chain
  }

  async readData() {
    try {
      const blockChainData = await bcModel.findAll()

      // return blockChainData

      if (blockChainData) {
        // console.log('blockChainData in readData: ', blockChainData)
        // return blockChainData
        if (this.isValidChain(blockChainData)) {
          return blockChainData
        } else {
          console.log('block incorrect!!!!!')
          return 'block incorrect!!!!!'
        }
      } else {
        console.log('Genesis block: ', Block.genesis())
        return Block.genesis()
      }

      
    } catch (error) {
      console.log('getData class error: ', error)
      return error
    }
  }

  addBlock(data) {
    const block = Block.mineBlock(this.chain[this.chain.length - 1], data)
    this.chain.push(block)
    this.writeDB(this.chain)
    return block
  }

  isValidChain(chain) {
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
      console.log('chain[0] isValid: ', chain[0])
      console.log('Block Genesis ', JSON.stringify(Block.genesis()))
      return false
    }
    for (let i = 1; i < chain.length; i++) {
      const block = chain[i]
      const lastBlock = chain[i - 1]
      if (
        block.lasthash !== lastBlock.hash ||
        block.hash !== Block.blockHash(block)
      ) {
        // console.log(`false chain[${i}] => `,chain[i]);
        console.log(`At record => ${i+1}`);
        console.log(`block.lasthash: ${block.lasthash} lastBlock.hash: ${lastBlock.hash}`);
        console.log(`block.hash: ${block.hash} Block.blockHash: `,Block.blockHash(block)
        )
        return false
      }
    }
    return true
  }

  replaceChain(newChain) {
    if (newChain.length <= this.chain.length) {
      // console.log('newChain.length: ', newChain.length)
      // console.log('this.chain.length: ', this.chain.length)
      // console.log('newChain: ', newChain)
      // console.log('this.chain: ', this.chain)
      console.log('Recieved chain is not longer than the current chain.')
      return
    } else if (!this.isValidChain(newChain)) {
      // console.log('chain[0]: ', JSON.stringify(this.chain[0]))
      // console.log('Block Genesis ', JSON.stringify(Block.genesis()))
      // console.log('newChain isValid: ', newChain)
      // for (let i = 1; i < newChain.length; i++) {
      //   const block = newChain[i]
      //   const lastBlock = newChain[i - 1]
      //   console.log('NO:', i)
      //   console.log('block.lasthash: ', block.lasthash)
      //   console.log('lastBlock.hash: ', lastBlock.hash)
      //   console.log('block.hash: ', block.hash)
      //   console.log('Block.blockHash(block): ', Block.blockHash(block))
      // }
      // console.log('block.lastHash : ', block.lastHash)
      // console.log('lastBlock.hash : ', lastBlock.hash)
      // console.log('block.hash : ', block.hash)
      // console.log('Block.blockHash(block) : ', Block.blockHash(block))
      console.log('The received chain is not valid.')
      return
    }

    // console.log('newChain.length2: ', newChain.length)
    // console.log('this.chain.length2: ', this.chain.length)

    console.log('Replacing blockchain with the new chain')
    this.chain = newChain
    // if (this.chain && process.env.API_SERVER === 'true' ) this.writeDB(this.chain)
    if (this.chain) this.writeDB(this.chain)
  }

  async writeDB(chain) {
    // console.log('chain data in writeDB', chain)
    const blockCount = await bcModel.count()
    // console.log('Block Count: ', blockCount)
    // console.log('Chain: ', chain)

    
    // console.log('!!!this.chain!!!: ', this.chain)
    // console.log('!!!this.chain array[0] !!!: ', this.chain[0])
    // if (blockCount == 0) {
    //   const blockCreated = await blockchain.create(this.chain)
    //   if (blockCreated) {
    //     console.log('blockCreated')
    //   } else {
    //     console.log('block create fail')
    //   }
    // }

    const lastRecord = await bcModel.findOne({
      limit: 1,
      order: [['timestamp', 'DESC']],
    })

    if (lastRecord) {
      var curBlock_lasthash = lastRecord.hash
    } else {
      let blockCreated = await bcModel.create(Block.genesis())
      if (blockCreated) {
        chain.map((item) => {
          bcModel
            .create(item)
            .then((result) => {
              console.log(
                'write data in blockCreated to DB successful: ',
                result,
              )
            })
            .catch((error) => {
              console.log('write data in blockCreated to DB failed: ', error)
            })
        })
      }
    }
    console.log('Block_lasthash: ', curBlock_lasthash)

    try {
      chain.map((item) => {
        // console.log('Item: ', item)

        // if (curBlock_lasthash === item.lasthash) {
        while (curBlock_lasthash === item.lasthash) {
          console.log('Item: ', item)
          bcModel
            .create(item)
            .then((result) => {
              console.log('write data to DB successful: ', result)
            })
            .catch((error) => {
              console.log('write data to DB failed: ', error)
            })
            curBlock_lasthash = item.hash;
        }
      })
    } catch (error) {
      console.log('write data to DB error: ', error.toString)
    }
  }
}

module.exports = Blockchain
