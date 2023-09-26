import {
  IConnector,
  IOpenWalletForSignEventArgs,
  RoninExtConnector,
  useWalletgo,
} from "@roninnetwork/walletgo"
import { ethers } from "ethers"
import { noop } from "lodash"
import { createContext, ReactNode, useCallback, useContext, useEffect } from "react"
import { isIOS } from "react-device-detect"

export interface IRoninWeb3Context {
  provider?: ethers.providers.JsonRpcProvider
  readOnlyProvider?: ethers.providers.StaticJsonRpcProvider
  connectedAddress?: string
  chainId?: number

  wrapConnectWallet: (eagerly?: boolean) => void
  wrapDisconnectWallet: () => void
  validateWallet: () => Promise<boolean>
}

const RoninWeb3Context = createContext<IRoninWeb3Context>({
  connectedAddress: "",
  provider: undefined,
  readOnlyProvider: undefined,
  wrapConnectWallet: (eagerly?: boolean) => {},
  wrapDisconnectWallet: () => {},
  validateWallet: () => Promise.resolve(false),
})

export const useRoninWeb3 = () => useContext(RoninWeb3Context)

export const RoninWeb3Provider = (props: { children: ReactNode }) => {
  const {
    walletChainId: chainId,
    account: connectedAddress,
    connector,
    walletProvider: provider,
    readProvider,
    activate,
    autoActivate,
    error,
    deactivate,
  } = useWalletgo()

  const wrapDisconnectWallet = () => {
    if (connector) {
      connector.events.removeListener("CONNECT_BY_LINK", noop)
      connector.events.removeListener("OPEN_WALLET_FOR_SIGN", noop)
    }
    deactivate()
  }

  const findWalletConnector = async () => {
    const walletConnector: IConnector = RoninExtConnector.create({})

    return walletConnector
  }
  const wrapConnectWallet = async (eagerly?: boolean) => {
    const walletConnector = await findWalletConnector()
    walletConnector.events.on("OPEN_WALLET_FOR_SIGN", (args: IOpenWalletForSignEventArgs) => {
      //NOTE: temporarily for ios device
      if (isIOS) return
      window.open(args.appLink, "_blank")
    })

    walletConnector.events.on("DISCONNECTED", () => {
      wrapDisconnectWallet()
    })

    if (eagerly) {
      return await autoActivate([walletConnector])
    } else {
      return await activate(walletConnector)
    }
  }

  const validateWallet = useCallback(async () => {
    if (!chainId) {
      await wrapConnectWallet()
      return false
    }

    return true
  }, [chainId])

  useEffect(() => {
    wrapConnectWallet(true)
  }, [])

  return (
    <RoninWeb3Context.Provider
      value={{
        connectedAddress,
        wrapConnectWallet,
        wrapDisconnectWallet,
        validateWallet,
        provider,
        readOnlyProvider: readProvider,
        chainId,
      }}
    >
      {props.children}
    </RoninWeb3Context.Provider>
  )
}
