const Block = require('./blockchain/block')
const bcModel = require('./models/blockchain')
const newbcModel = require('./models/newblockchain')

blocks = [];

const init = async () => {
    const blockchains = await bcModel.findAll()
    if (blockchains) {
        for (let i = 0; i < blockchains.length; i++) {
            blocks.push(blockchains[i])
        }
    }
    return blocks;

}

const writeDB = async (chains) => {
    if (chains) {

        newbcModel.create(Block.genesis())

        for (let x = 1; x < chains.length; x++) {

        // let i = 11

        const timestamp = chains[x].dataValues.timestamp;
        const lasthash = chains[x-1].dataValues.hash;
        const user = chains[x].dataValues.user;
        const action = chains[x].dataValues.action;
        const actionvalue = chains[x].dataValues.actionvalue;
        const actiondate = chains[x].dataValues.actiondate;
        const actiontime = chains[x].dataValues.actiontime;
        const nonce = chains[x].dataValues.nonce;
        const difficulty = chains[x].dataValues.difficulty;

        chains[x].dataValues.lasthash = chains[x-1].dataValues.hash;
        chains[x].dataValues.hash = Block.blockHash({
            timestamp,
            lasthash,
            user,
            action,
            actionvalue,
            actiondate,
            actiontime,
            nonce,
            difficulty,
        })


        newbcModel.create(chains[x].dataValues)
        // console.log('hash: ', chains[x].dataValues.hash)
        // console.log('lasthash: ',chains[x].dataValues.lasthash)
      }

    //   console.log('WTF hash [11]: ', chains[11].dataValues.hash)
    //   console.log('WTF hash: ', chains[12].dataValues.hash)
    //   console.log('WTF lasthash: ',chains[12].dataValues.lasthash)    
    }


}

init();

setTimeout(() => {
    writeDB(blocks)
},5000)

// if (a) {
//     console.log(a)
// }

// writeDB(blocks);

