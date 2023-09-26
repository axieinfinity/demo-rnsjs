import { useEffect, useMemo, useState } from "react"
import { useRnsContext } from "src/context/RnsContext"

export const usePrimary = (address: string) => {
  const ens = useRnsContext()
  const { ready, getName, getAddr } = ens
  const [name, setName] = useState<{ name: string }>()
  useEffect(() => {
    if (!ready || !address) return
    ;(async () => {
      const res = await getName(address)
      if (!res || !res.name) return null
      const reverseName = await getAddr(res.name)
      if (reverseName?.toString().toLowerCase() !== address?.toLowerCase()) {
        return null
      }
      setName({
        ...res,
        name: res.name as string | undefined,
      })
    })()
  }, [ready, !!address])
  return name
}
