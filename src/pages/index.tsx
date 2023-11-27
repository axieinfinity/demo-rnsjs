import { NextPage } from "next"
import { useState } from "react"
import { useRnsContext } from "src/context/RnsContext"
import { useRoninWeb3 } from "src/context/Web3Context"
import { usePrimary } from "src/hooks/usePrimary"

const HomePage: NextPage = () => {
  const { wrapConnectWallet, wrapDisconnectWallet, connectedAddress } = useRoninWeb3()
  const primary = usePrimary(connectedAddress)
  const [address, setAddress] = useState("")
  const [nameResolve, setNameResolve] = useState("")
  const [name, setName] = useState("")
  const [addressResolve, setAddressResolve] = useState("")
  const ens = useRnsContext()
  return (
    <div className="mt-32 flex h-[100vh] flex-col items-center justify-center">
      {!connectedAddress ? (
        <button
          className="rounded-lg py-2 bg-blue-500 text-blue-100 hover:bg-blue-600 px-4 duration-300"
          onClick={() => wrapConnectWallet()}
        >
          Connect Wallet
        </button>
      ) : (
        <div className="justify-content flex flex-col items-center">
          <div className="mb-24 flex">
            Your connected address: <div className="mx-8">{connectedAddress}</div>
            <>
              {` - `}
              {primary?.name
                ? `Your primary name: ${primary.name}`
                : `You don't set primary for this addres`}
            </>
          </div>
          <button
            className="rounded-lg py-2 bg-blue-500 text-blue-100 hover:bg-blue-600 px-4 duration-300"
            onClick={() => wrapDisconnectWallet()}
          >
            Disconnect Wallet
          </button>
        </div>
      )}
      <div className="mt-32 flex flex-col items-center justify-center rounded-2x border border-solid border-tc-border p-32">
        <div className="flex items-center">
          <p className="mr-16 block">Resolve from address to name</p>
          <input
            className="min-w-[400px]"
            placeholder="Type address here. Ex: 0xd24D87DDc1917165435b306aAC68D99e0F49A3Fa"
            value={address}
            onChange={e => setAddress(e.target.value)}
          />
          <button
            className="mx-16"
            onClick={async () => {
              const name_ = await ens.getName(address)
              setNameResolve(name_.name)
            }}
          >
            Resolve
          </button>
        </div>
        <p className="mt-8">
          Resolve from an address will result in the primary name whether it has been set.
        </p>
        {nameResolve && <p className="mt-16">Result: {nameResolve}</p>}
      </div>
      <div className="mt-32 flex flex-col items-center justify-center rounded-2x border border-solid border-tc-border p-32">
        <div className="flex items-center">
          <p className="mr-16 block">Resolve from name to address</p>
          <input
            className="rounded-lg py-2 bg-blue-500 text-blue-100 hover:bg-blue-600 min-w-[400px] px-4 duration-300"
            placeholder="Type name here. Ex: robert.ron"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <button
            className="rounded-lg py-2 bg-blue-500 text-blue-100 hover:bg-blue-600 mx-16 px-4 duration-300"
            onClick={async () => {
              const addr_ = await ens.getAddr(name)
              setAddressResolve(addr_)
            }}
          >
            Resolve
          </button>
        </div>
        <p className="mt-8">
          Resolve from a name will result in the corresponding owner of that name.
        </p>
        {addressResolve && <p className="mt-16">Result: {addressResolve}</p>}
      </div>
    </div>
  )
}

export default HomePage
