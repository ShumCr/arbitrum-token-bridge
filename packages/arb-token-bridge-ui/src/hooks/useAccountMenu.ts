import { JsonRpcProvider } from '@ethersproject/providers'
import { useState, useEffect, useMemo } from 'react'
import Resolution from '@unstoppabledomains/resolution'

import {
  useProvider,
  useAccount,
  useDisconnect,
  useNetwork,
  useEnsName,
  useEnsAvatar
} from 'wagmi'
import { useArbQueryParams } from './useArbQueryParams'
import { shortenAddress } from '../util/CommonUtils'
import { onDisconnectHandler } from '../util/walletConnectUtils'

type UDInfo = { name: string | null }
const udInfoDefaults: UDInfo = { name: null }

async function tryLookupUDName(provider: JsonRpcProvider, address: string) {
  const UDresolution = Resolution.fromEthersProvider({
    uns: {
      // TODO => remove Layer2 config when UD lib supports our use case
      // Layer2 (polygon) is required in the object type but we only want to use Layer1
      // This is a hack to only support Ethereum Mainnet UD names
      // https://github.com/unstoppabledomains/resolution/issues/229
      locations: {
        Layer1: {
          network: 'mainnet',
          provider
        },
        Layer2: {
          network: 'mainnet',
          provider
        }
      }
    }
  })
  try {
    return await UDresolution.reverse(address)
  } catch (error) {
    return null
  }
}

export const useAccountMenu = () => {
  const l1Provider = useProvider({ chainId: 1 })
  const { address } = useAccount()
  const { disconnect } = useDisconnect({
    onSettled: onDisconnectHandler
  })
  const { chain } = useNetwork()

  const [, setQueryParams] = useArbQueryParams()

  const [udInfo, setUDInfo] = useState<UDInfo>(udInfoDefaults)
  const { data: ensName } = useEnsName({
    address,
    chainId: 1
  })

  const { data: ensAvatar } = useEnsAvatar({
    address,
    chainId: 1
  })

  useEffect(() => {
    if (!address) return
    async function resolveUdName() {
      const udName = await tryLookupUDName(
        l1Provider as JsonRpcProvider,
        address as string
      )

      setUDInfo({ name: udName })
    }
    resolveUdName()
  }, [address, l1Provider])

  const accountShort = useMemo(() => {
    if (typeof address === 'undefined') {
      return ''
    }

    return shortenAddress(address)
  }, [address])

  useEffect(() => {
    if (!address) return
    async function resolveUdName() {
      const udName = await tryLookupUDName(
        l1Provider as JsonRpcProvider,
        address as string
      )

      setUDInfo({ name: udName })
    }
    resolveUdName()
  }, [address, l1Provider])

  return {
    address,
    accountShort,
    ensName,
    ensAvatar,
    disconnect,
    udInfo,
    chain,
    setQueryParams
  }
}
