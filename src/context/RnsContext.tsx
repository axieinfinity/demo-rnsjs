import { JsonRpcProvider } from "@ethersproject/providers"
import { ContractName, RNS } from "@roninnetwork/rnsjs"
import React, { createContext, FC, ReactNode, useContext, useMemo, useRef, useState } from "react"

import { useRoninWeb3 } from "./Web3Context"

const opts: ConstructorParameters<typeof RNS>[0] = {}

if (process.env.NEXT_PUBLIC_PROVIDER && process.env.NEXT_PUBLIC_DEPLOYMENT_ADDRESSES) {
  const deploymentAddresses = JSON.parse(process.env.NEXT_PUBLIC_DEPLOYMENT_ADDRESSES!) as Record<
    ContractName | "RNSRegistryLogic",
    string
  >
  opts.getContractAddress = () => contractName => deploymentAddresses[contractName]
}

if (process.env.NEXT_PUBLIC_GRAPH_URI) {
  opts.graphURI = process.env.NEXT_PUBLIC_GRAPH_URI
}
const defaultValue: RNS = new RNS(opts)

const EnsContext = createContext({
  ...defaultValue,
  ready: false,
})

interface IRnsContext extends RNS {
  ready: boolean
}

interface IRnsProvider {
  children: ReactNode
}

const RnsProvider: FC<IRnsProvider> = ({ children }) => {
  const [ready, setReady] = useState(false)
  const chainIdRef = useRef<number | null>(null)
  const chainSetPromise = useRef<Promise<any> | null>(null)
  const { provider, chainId } = useRoninWeb3()

  const setChainPromise = () => {
    const currentProvider = new JsonRpcProvider(
      chainId === 2021
        ? "https://saigon-testnet.roninchain.com/rpc"
        : "https://api.roninchain.com/rpc",
    )
    // TODO: refactor this
    const currentChainId = chainId
    return defaultValue.setProvider(currentProvider as any, currentChainId).then(() => {
      chainIdRef.current = currentChainId
      chainSetPromise.current = null
      setReady(true)
    })
  }

  useMemo(() => {
    if (typeof window !== "undefined" && !chainSetPromise.current && provider && chainId) {
      chainSetPromise.current = setChainPromise()
    }
  }, [provider, chainId])

  const value = useMemo(
    () =>
      new Proxy(
        { ...defaultValue, ready },
        {
          // chain id safety check
          get(target, prop, reciever) {
            const targetFn = target[prop as keyof typeof target]
            // if on client + target is async function
            if (
              typeof window !== "undefined" &&
              typeof targetFn === "function" &&
              targetFn.constructor?.name === "AsyncFunction"
            ) {
              const currentChainId = 2021
              // if reference chainId isn't up to date
              if (chainIdRef.current !== currentChainId) {
                // if there is no ongoing chain set promise
                if (!chainSetPromise.current) {
                  // set ready to false before making changes
                  setReady(false)
                  // set chain set promise to new promise
                  chainSetPromise.current = setChainPromise()
                }
                // eslint-disable-next-line func-names
                return async function (this: any, ...args: any[]) {
                  // wait for existing chain set promise
                  await chainSetPromise.current
                  // return result of target function
                  // eslint-disable-next-line @typescript-eslint/ban-types
                  return (targetFn as Function)(...args)
                }
              }
            }
            // pass through all other getters
            return Reflect.get(target, prop, reciever)
          },
        },
      ),
    [ready],
  )
  return <EnsContext.Provider value={value}>{children}</EnsContext.Provider>
}

function useRnsContext() {
  const context = useContext(EnsContext)
  return context
}
export { RnsProvider, useRnsContext }
