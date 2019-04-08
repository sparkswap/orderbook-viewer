import React, { Component } from 'react';
import { Button, Container, Header, Icon, Image, Responsive, Segment, Table } from 'semantic-ui-react'
import MarketSelector from './market-selector.js'
import MarketData from './market-data.js'
import icon from './icon.svg';
import logo from './logo.svg'
import './App.css';

/**
 * @constant
 * @type {Object}
 */
const FORMAT_TYPES = Object.freeze({
  ASK: 'ASK',
  BID: 'BID',
  DEPTH: 'DEPTH'
})

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      orderbook: {
        asks: [],
        bids: []
      }
    }

    this.markets = [
      {
        displayName: 'BTC/LTC',
        name: 'BTC/LTC'
      }
    ]
    this.host = 'https://viewer.mainnet.sparkswap.com:27592'

    // This is hardcoded for demo purposes only
    this.username = 'sparkswap'
    this.password = 'sparkswap'
  }

  componentDidMount () {
    // Analytics
    window.analytics.page('Orderbook')

    this.marketData = new MarketData(this.markets[0].name, this.host, this.username, this.password)
    this.marketData.on('update', (orderbook) => {
      this.setState({ orderbook })
    })
    this.marketData.subscribe()
  }

  static showMailingPopUp () {
    // Analytics
    App.trackLink('Mailing Popup')

    window.dojoRequire(["mojo/signup-forms/Loader"], function(L) {
      L.start({
        "baseUrl": "mc.us20.list-manage.com",
        "uuid": "4961901816385b733cb9d63bf",
        "lid":"d758719e3e",
        "uniqueMethods":true
      })
    })
    document.cookie = 'MCPopupClosed=;path=/;expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    document.cookie = 'MCPopupSubscribed=;path=/;expires=Thu, 01 Jan 1970 00:00:00 UTC;';
  };

  static trackLink (link) {
    window.analytics.track(link)
  }

  /**
   * Generates an array of HTLM elements (in JSX) that represents the orderbook as a
   * table in Semantic UI.
   *
   * @returns {Array}
   */
  renderOrders () {
    const { orderbook } = this.state
    const combinedOrderbook = []

    for (let i = 0; i < Math.max(orderbook.asks.length, orderbook.bids.length); i++) {
      combinedOrderbook.push({
        ask: orderbook.asks[i],
        bid: orderbook.bids[i]
      })
    }

    const formattedOrders = []
    combinedOrderbook.forEach((row) => {
      formattedOrders.push(App.formatRow(row))
    })

    return formattedOrders
  }

  /**
   * Formats a row in the orders table with bids or asks.
   * @param {Object} row - Object with price and amount
   * @returns {*} JSX of formatted row
   */
  static formatRow (row) {
    return (
      <Table.Row>
        <Table.Cell>{row.ask ? App.formatText(row.ask.price, FORMAT_TYPES.ASK) : ''}</Table.Cell>
        <Table.Cell>{row.ask ? App.formatText(row.ask.amount, FORMAT_TYPES.DEPTH) : ''}</Table.Cell>
        <Table.Cell>{row.bid ? App.formatText(row.bid.price, FORMAT_TYPES.BID) : ''}</Table.Cell>
        <Table.Cell>{row.bid ? App.formatText(row.bid.amount, FORMAT_TYPES.DEPTH) : ''}</Table.Cell>
      </Table.Row>
    )
  }

  /**
   * Takes a number as a string and applies coloring so all digits following the last
   * significant digit are grayed out.
   *
   * @param text
   * @param type - represents whether to format as a bid, ask, or depth
   * @returns {Array}
   */
  static formatText (text, type) {
    const firstNonSigZero = App.findFirstNonSigZero(text)
    const needsGrayColoring = firstNonSigZero > -1

    const formatted = []
    if (needsGrayColoring) {
      const significantDigits = [...text].slice(0, firstNonSigZero)
      const nonSigDigits = (<span className='non-sig-digits'>{[...text].slice(firstNonSigZero)}</span>)

      formatted.push(App.addColoring(significantDigits, type), nonSigDigits)
    } else {
      formatted.push(App.addColoring(text, type))
    }

    return formatted
  }

  /**
   * Adds coloring based on the type of text (Bid, Ask, Depth)
   *
   * @param {string} text
   * @param {string} type - represents whether to format as a bid, ask, or depth
   * @returns {*} JSX of colored text
   */
  static addColoring (text, type) {
    switch (type) {
      case FORMAT_TYPES.BID:
        return (<span className='bid-sig-digits'>{text}</span>)
      case FORMAT_TYPES.ASK:
        return (<span className='ask-sig-digits'>{text}</span>)
      case FORMAT_TYPES.DEPTH:
        return (<span className='depth-sig-digits'>{text}</span>)
      default:
        return (<span>{text}</span>)
    }
  }

  /**
   * Finds the index of the first non significant zero. Returns index, or -1 if none.
   *
   * @param {string} text
   * @returns {number} Index of the first non significant zero
   */
  static findFirstNonSigZero (text) {
    let firstNonSigZero = -1
    for (let i = 0; i < text.length; i++) {
      const remaining = [...text].slice(i)
      const allZeroesRemaining = remaining.every(char => { return char === '0' || char === '.' })

      if (allZeroesRemaining) {
        firstNonSigZero = i
        break
      }
    }

    return firstNonSigZero
  }

  render() {
    const { markets } = this

    return (
      <div className="App">
        <Container>
          <Responsive as={Segment} minWidth={768} basic clearing className="Header">
            <a href="/" className="Header-link">
              <Header as="h1" className="Logo">
                <Image src={icon} size="large" />
                <Header.Content>
                  orderbook
                  <Header.Subheader>Mainnet</Header.Subheader>
                </Header.Content>
              </Header>
            </a>
            <div className="Install large">
              <a href="https://sparkswap.com/docs/getting-started">
                <Button size="large" color='black' onClick={() => App.trackLink('install')}>Install Now</Button>
              </a>
              <span className="sub-text">Start Trading</span>
            </div>
            <div className="market-selector">
              <MarketSelector markets={markets} />
            </div>
          </Responsive>
          <Responsive as={Segment} minWidth={600} maxWidth={767} basic clearing className="Header">
            <a href="/" className="Header-link">
              <Header as="h1" className="Logo-medium">
                <Image src={icon} size="large" />
                <Header.Content>
                  orderbook
                  <Header.Subheader>Mainnet</Header.Subheader>
                </Header.Content>
              </Header>
            </a>
            <div className="Install marge">
              <a href="https://sparkswap.com/docs/getting-started">
                <Button size="small" color='black' onClick={() => App.trackLink('install')}>Install Now</Button>
              </a>
              <span className="sub-text">Start Trading</span>
            </div>
            <div className="market-selector-medium">
              <MarketSelector markets={markets} />
            </div>
          </Responsive>
          <Responsive as={Segment} minWidth={467} maxWidth={599} basic clearing className="Header">
            <a href="/" className="Header-link">
              <Header as="h1" className="Logo-medium">
                <Image src={icon} size="large" />
              </Header>
            </a>
            <div className="Install medium">
              <a href="https://sparkswap.com/docs/getting-started">
                <Button size="tiny" color='black' onClick={() => App.trackLink('install')}>Install Now</Button>
              </a>
              <span className="sub-text">Start Trading</span>
            </div>
            <div className="market-selector-medium">
              <MarketSelector markets={markets} />
            </div>
          </Responsive>
          <Responsive as={Segment} minWidth={340} maxWidth={466} basic clearing className="Header">
            <a href="/" className="Header-link">
              <Header as="h1" className="Logo-medium">
                <Image src={icon} size="large" />
              </Header>
            </a>
            <div className="Install small">
              <a href="https://sparkswap.com/docs/getting-started">
                <Button size="tiny" color='black' onClick={() => App.trackLink('install')}>Install Now</Button>
              </a>
            </div>
            <div className="market-selector-medium">
              <MarketSelector markets={markets} />
            </div>
          </Responsive>
          <Responsive as={Segment} maxWidth={339} basic clearing className="Header">
            <a href="/" className="Header-link">
              <Header as="h1" className="Logo-medium">
                <Image src={icon} size="large" />
              </Header>
            </a>
            <div className="Install small">
              <a href="https://sparkswap.com/docs/getting-started">
                <Button size="mini" color='black' onClick={() => App.trackLink('install')}>Install</Button>
              </a>
            </div>
            <div className="market-selector-medium">
              <MarketSelector markets={markets} />
            </div>
          </Responsive>
          <div className="horizontal-scrolling">
            <Table unstackable>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell colSpan="2">Asks</Table.HeaderCell>
                  <Table.HeaderCell colSpan="2">Bids</Table.HeaderCell>
                </Table.Row>
                <Table.Row>
                  <Table.HeaderCell width={4}>Price</Table.HeaderCell>
                  <Table.HeaderCell width={4}>Size</Table.HeaderCell>
                  <Table.HeaderCell width={4}>Price</Table.HeaderCell>
                  <Table.HeaderCell width={4}>Size</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {this.renderOrders()}
              </Table.Body>
            </Table>
          </div>
          <Responsive as={Segment} minWidth={635} basic className="Footer">
            <div>
              <a href="https://sparkswap.com">
                <Image src={logo} size="small" />
              </a>
            </div>
            <div className="links">
              <a href="https://sparkswap.com/chat" className="link-item" onClick={() => App.trackLink('chat')}>
                <Icon name="discord" />
                Chat
              </a>
              <a href="https://sparkswap.com/docs/getting-started" className="link-item" onClick={() => App.trackLink('docs')}>
                <Icon name="file alternate" />
                Docs
              </a>
              <a href="https://sparkswap.com/onboarding" className="link-item" onClick={() => App.trackLink('help')}>
                <Icon name="life ring" />
                Get Help
              </a>
              <a href="#" onClick={App.showMailingPopUp} className="link-item">
                <Icon name="envelope" />
                Subscribe to Updates
              </a>
            </div>
          </Responsive>
          <Responsive as={Segment} minWidth={537} maxWidth={634} basic className="Footer">
            <div>
              <a href="https://sparkswap.com">
                <Image src={logo} size="small" />
              </a>
            </div>
            <div className="links">
              <a href="https://sparkswap.com/chat" className="link-item" onClick={() => App.trackLink('chat')}>
                <Icon name="discord" />
                Chat
              </a>
              <a href="https://sparkswap.com/docs/getting-started" className="link-item" onClick={() => App.trackLink('docs')}>
                <Icon name="file alternate" />
                Docs
              </a>
              <a href="https://sparkswap.com/onboarding" className="link-item" onClick={() => App.trackLink('help')}>
                <Icon name="life ring" />
                Help
              </a>
              <a href="#" onClick={App.showMailingPopUp} className="link-item">
                <Icon name="envelope" />
                Subscribe
              </a>
            </div>
          </Responsive>
          <Responsive as={Segment} minWidth={385} maxWidth={536} basic className="Footer">
            <div>
              <a href="https://sparkswap.com">
                <Image src={logo} size="small" />
              </a>
            </div>
            <div className="links">
              <a href="https://sparkswap.com/chat" className="link-item" onClick={() => App.trackLink('chat')}>
                <Icon name="discord" />
              </a>
              <a href="https://sparkswap.com/docs/getting-started" className="link-item" onClick={() => App.trackLink('docs')}>
                <Icon name="file alternate" />
              </a>
              <a href="https://sparkswap.com/onboarding" className="link-item" onClick={() => App.trackLink('help')}>
                <Icon name="life ring" />
              </a>
              <a href="#" onClick={App.showMailingPopUp} className="link-item">
                <Icon name="envelope" />
              </a>
            </div>
          </Responsive>
          <Responsive as={Segment} maxWidth={384} basic className="Footer">
            <div>
              <a href="https://sparkswap.com">
                <Image src={logo} size="tiny" />
              </a>
            </div>
            <div className="links">
              <a href="https://sparkswap.com/chat" className="link-item-small" onClick={() => App.trackLink('chat')}>
                <Icon name="discord" />
              </a>
              <a href="https://sparkswap.com/docs/getting-started" className="link-item-small" onClick={() => App.trackLink('docs')}>
                <Icon name="file alternate" />
              </a>
              <a href="https://sparkswap.com/onboarding" className="link-item-small" onClick={() => App.trackLink('help')}>
                <Icon name="life ring" />
              </a>
              <a href="#" onClick={App.showMailingPopUp} className="link-item-small">
                <Icon name="envelope" />
              </a>
            </div>
          </Responsive>

        </Container>
      </div>
    );
  }
}

export default App;
