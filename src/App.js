import React, { Component } from 'react';
import { Button, Container, Header, Image, Segment, Table } from 'semantic-ui-react'
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
    this.host = 'http://127.0.0.1:27592'
  }

  componentDidMount () {
    this.marketData = new MarketData(this.markets[0].name, this.host)
    this.marketData.on('update', (orderbook) => {
      this.setState({ orderbook })
    })
    this.marketData.subscribe()
  }

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
          <Segment basic clearing>
            <a href="/">
              <Header floated="left" as="h1" className="Logo">
                <Image src={icon} size="large" />
                <Header.Content>
                  orderbook
                  <Header.Subheader>Mainnet</Header.Subheader>
                </Header.Content>
              </Header>
            </a>
            <Header floated="right" as="h3">
              <MarketSelector markets={markets} />
            </Header>
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
            <div className="Install">
              <a href="https://sparkswap.com/docs/getting-started">
                <Button color='grey'>Install Now</Button>
              </a>
            </div>
            <div className="Discord">
              <a href="https://sparkswap.com/chat">
                Discord
              </a>
            </div>
            <div className="Support">
              <a href="https://sparkswap.com/onboarding">
                Support
              </a>
            </div>
          </Segment>
        </Container>
      </div>
    );
  }
}

export default App;
