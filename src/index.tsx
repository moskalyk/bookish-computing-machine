import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { KitProvider } from '@0xsequence/kit'
import { getDefaultConnectors } from '@0xsequence/kit-connectors'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createConfig, http, WagmiProvider, WagmiConfig } from 'wagmi'
import { arbitrumSepolia, Chain } from 'wagmi/chains'
 
const queryClient = new QueryClient() 
 
function Dapp() {
  const chains = [arbitrumSepolia] as [Chain, ...Chain[]]
  
  const projectAccessKey = process.env.REACT_APP_PROJECT_ACCESS_KEY!
 
  const connectors = getDefaultConnectors({
    walletConnectProjectId: process.env.REACT_APP_WALLET_CONNECT_ID!,
    defaultChainId: 421614,
    appName: 'bookish computing machine',
    projectAccessKey
  })
 
  const transports: any = {}
 
  chains.forEach(chain => {
    transports[chain.id] = http()
  })
  
  //@ts-ignore
  const config = createConfig({
    transports,
    connectors,
    chains
  })
 
  return (
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}> 
        <KitProvider config={{}}>
          <App />
        </KitProvider>
      </QueryClientProvider>
    </WagmiConfig>
  );
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Dapp />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
