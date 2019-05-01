# Orderbook Viewer

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

Contains the SPA for viewing the orderbook on mainnet.

## Test locally

1. `npm start`

## Deploy

To deploy the website to `http://orderbook.mainnet.sparkswap.com`:

1. In the main directory run `npm run build`
    - This builds the app for production to the `build` folder
2. Make sure you are using the `sparkswap` team in the `now` cli
    - `now switch` then select the `sparkswap` team
3. `cd build && now`
    - Deploys using `now`
4. `now alias <deploy_url> orderbook.mainnet.sparkswap.com`
    - The subdomain is already setup, so running this command will deploy the service to the subdomain
