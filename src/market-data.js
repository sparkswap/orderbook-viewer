import axios from 'axios'
import EventEmitter from 'events'

const ORDERBOOK_URL = '/v1/orderbook'

class MarketData extends EventEmitter {
  constructor (market, host, pollEvery = 3000) {
    super()
    this.market = market
    this.host = host
    this.pollEvery = pollEvery
  }

  retrieve () {
    const config = {
      // This auth is used for demo purposes only
      auth: {
        username: 'sparkswap',
        password: 'sparkswap'
      }
    }

    return axios.get(`${this.host}${ORDERBOOK_URL}?market=${this.market}`, config)
  }

  async poll () {
    const orderbook = (await this.retrieve()).data

    this.emit('update', orderbook)
  }

  subscribe () {
    this.poll()
    this.timer = setInterval(this.poll.bind(this), this.pollEvery)
  }

  unsubscribe() {
    clearInterval(this.timer)
  }
}

export default MarketData