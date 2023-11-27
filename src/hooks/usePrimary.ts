import { useEffect, useMemo, useState } from "react"
import { useRnsContext } from "src/context/RnsContext"

export const usePrimary = (address: string) => {
  const ens = useRnsContext()
  const { ready, getName } = ens
  const [name, setName] = useState<{ name: string }>()
  useEffect(() => {
    if (!ready || !address) return
    ;(async () => {
      const res = await getName(address)
      setName({
        ...res,
        name: res.name as string | undefined,
      })
    })()
  }, [ready, !!address])
  return name
}
