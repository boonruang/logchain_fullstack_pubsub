const redis = require('redis');

const CHANNELS = {
  TEST : 'TEST',
  BLOCKCHAIN : 'BLOCKCHAIN',
}

class PubSub {
  constructor({blockchain}) {
    this.blockchain = blockchain;

if (process.env.ENV === 'development') {
    this.publisher = redis.createClient();
    this.subscriber = redis.createClient();
} else {
    this.publisher = redis.createClient({ url: 'redis://default:Angsana01@192.168.7.58', port: 6379 });
    this.subscriber = redis.createClient({ url: 'redis://default:Angsana01@192.168.7.58', port: 6379 });
}

    this.subscribeToChannels();

    this.subscriber.on(
      'message',
      (channel,message) => {this.handleMessage(channel,message)
    })

  }

  handleMessage(channel,message) {
    console.log(`Message reciveved. Channel: ${channel}.`);
    // console.log(`Message reciveved. Channel: ${channel}. Message: ${message}`);

    const parsedMessage = JSON.parse(message);

    // console.log('parsedMsg ',parsedMessage);

    switch(channel) {
      case CHANNELS.BLOCKCHAIN:
        this.blockchain.replaceChain(parsedMessage);
        break;
      default:
        return;
    }

  }

  subscribeToChannels() {
    Object.values(CHANNELS).forEach((channel) => {
      this.subscriber.subscribe(channel)
    })
  }

  publish({channel, message}) {
     this.subscriber.unsubscribe(channel, () => {
       this.publisher.publish(channel,message, () => {
        this.subscriber.subscribe(channel)
       })
     })
  }

  broadcastChain() {
    this.publish({
      channel: CHANNELS.BLOCKCHAIN,
      message: JSON.stringify(this.blockchain.chain)
    })
  }

}

module.exports = PubSub;

