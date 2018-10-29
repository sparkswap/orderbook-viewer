import React, { Component } from 'react';
import { Dropdown } from 'semantic-ui-react'
import './market-selector.css'

class MarketSelector extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const { markets = [] } = this.props
    const defaultValue = markets[0] ? markets[0].name : ''
    const options = markets.map(market => { return { value: market.name, text: market.displayName } })
    return (
      <div className="MarketSelector">
        Market:{' '}
        <Dropdown inline options={options} defaultValue={defaultValue} />
      </div>
    )
  }
}

export default MarketSelector