import React, { Component } from 'react';
import { Button, Container, Header, Icon, Image, Segment, Table } from 'semantic-ui-react'
import MarketSelector from './market-selector.js'
import MarketData from './market-data.js'
import icon from './icon.svg';
import logo from './logo.svg'
import './App.css';

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
  }

  componentDidMount () {
    this.marketData = new MarketData(this.markets[0].name, this.host)
    this.marketData.on('update', (orderbook) => {
      this.setState({ orderbook })
    })
    this.marketData.subscribe()
  }

  showMailingPopUp () {
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

  render() {
    const { markets } = this
    const { orderbook } = this.state
    const combinedOrderbook = []

    for (var i=0; i<Math.max(orderbook.asks.length, orderbook.bids.length); i++) {
      combinedOrderbook.push({
        ask: orderbook.asks[i],
        bid: orderbook.bids[i]
      })
    }

    return (
      <div className="App">
        <Container>
          <Segment basic clearing className="Header">
            <a href="/" className="Header-link">
              <Header as="h1" className="Logo">
                <Image src={icon} size="large" />
                <Header.Content>
                  orderbook
                  <Header.Subheader>Mainnet</Header.Subheader>
                </Header.Content>
              </Header>
            </a>
            <div className="Install">
              <a href="https://sparkswap.com/docs/getting-started">
                <Button size="large" color='black'>Install Now</Button>
              </a>
            </div>
            <div className="market-selector">
              <MarketSelector markets={markets} />
            </div>
          </Segment>
          <Table>
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
              {combinedOrderbook.map((row) => {
                return (
                  <Table.Row>
                    <Table.Cell>{row.ask ? row.ask.price : ''}</Table.Cell>
                    <Table.Cell>{row.ask ? row.ask.amount : ''}</Table.Cell>
                    <Table.Cell>{row.bid ? row.bid.price : ''}</Table.Cell>
                    <Table.Cell>{row.bid ? row.bid.amount : ''}</Table.Cell>
                  </Table.Row>
                )
              })}
            </Table.Body>
          </Table>
          <Segment basic className="Footer">
            <div>
              <a href="https://sparkswap.com">
                <Image src={logo} size="small" />
              </a>
            </div>
            <div className="links">
              <a href="https://sparkswap.com/chat" className="link-item">
                <Icon name="discord" />
                Chat
              </a>
              <a href="https://github.com/sparkswap" className="link-item">
                <Icon name="github" />
                GitHub
              </a>
              <a href="https://sparkswap.com/onboarding" className="link-item">
                <Icon name="life ring" />
                Get Help
              </a>
              <a href="#" onClick={this.showMailingPopUp} className="link-item">
                <Icon name="newspaper" />
                Subscribe to Updates
              </a>
            </div>
          </Segment>
        </Container>
      </div>
    );
  }
}

export default App;
