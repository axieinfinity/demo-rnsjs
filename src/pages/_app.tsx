import "src/styles/global.css"

import { WalletgoProvider } from "@roninnetwork/walletgo"
import { AppProps } from "next/app"
import Head from "next/head"
import { RnsProvider } from "src/context/RnsContext"
import { RoninWeb3Provider } from "src/context/Web3Context"

const NextApp = (props: AppProps) => {
  const { Component, pageProps } = props

  return (
    <>
      <Head>
        <title>Demo RNSJS</title>

        <link rel="shortcut icon" href="https://cdn.skymavis.com/explorer-cdn/asset/fav.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta name="author" content="skymavis.com" />
        <meta
          name="keywords"
          content="axie data, ronin data, ronin block explorer, axie research, axie block explorer"
        />
        <meta
          name="description"
          content="The Ronin Block Explorer is an analytics platform for Ronin."
        />
      </Head>

      <WalletgoProvider defaultChainId={2021}>
        <RoninWeb3Provider>
          <RnsProvider>
            <Component {...pageProps} />
          </RnsProvider>
        </RoninWeb3Provider>
      </WalletgoProvider>
    </>
  )
}

export default NextApp
