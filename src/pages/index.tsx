import { WalletIcon } from "@axieinfinity/ronin-icons"
import { Button, FormHelper, TextField, Typo } from "@axieinfinity/ronin-ui"
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
        <Button
          className="w-fit"
          intent="primary"
          icon={() => <WalletIcon size={20} />}
          label="Connect Wallet"
          onClick={() => wrapConnectWallet()}
        />
      ) : (
        <div className="justify-content flex flex-col items-center">
          <Typo className="mb-24 flex">
            Your connected address:{" "}
            <Typo dim className="mx-8">
              {connectedAddress}
            </Typo>
            <>
              {` - `}
              {primary?.name
                ? `Your primary name: ${primary.name}`
                : `You don't set primary for this addres`}
            </>
          </Typo>
          <Button
            className="w-fit"
            intent="primary"
            icon={() => <WalletIcon size={20} />}
            label="Disconnect Wallet"
            onClick={() => wrapDisconnectWallet()}
          />
        </div>
      )}
      <div className="mt-32 flex flex-col items-center justify-center rounded-2x border border-solid border-tc-border p-32">
        <div className="flex items-center">
          <Typo className="mr-16 block">Resolve from address to name</Typo>
          <TextField
            className="min-w-[400px]"
            placeholder="Type address here. Ex: 0xd24D87DDc1917165435b306aAC68D99e0F49A3Fa"
            value={address}
            onChange={e => setAddress(e.target.value)}
          />
          <Button
            className="mx-16"
            label="Resolve"
            onClick={async () => {
              const name_ = await ens.getName(address)
              setNameResolve(name_.name)
            }}
          ></Button>
        </div>
        <FormHelper
          intent="warning"
          className="mt-8"
          content="Resolve from an address will result in the primary name whether it has been set."
        />
        {nameResolve && <Typo className="mt-16">Result: {nameResolve}</Typo>}
      </div>
      <div className="mt-32 flex flex-col items-center justify-center rounded-2x border border-solid border-tc-border p-32">
        <div className="flex items-center">
          <Typo className="mr-16 block">Resolve from name to address</Typo>
          <TextField
            className="min-w-[400px]"
            placeholder="Type name here. Ex: robert.ron"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <Button
            className="mx-16"
            label="Resolve"
            onClick={async () => {
              const addr_ = await ens.getAddr(name)
              setAddressResolve(addr_)
            }}
          ></Button>
        </div>
        <FormHelper
          intent="warning"
          className="mt-8"
          content="Resolve from a name will result in the corresponding owner of that name."
        />
        {addressResolve && <Typo className="mt-16">Result: {addressResolve}</Typo>}
      </div>
    </div>
  )
}

export default HomePage
