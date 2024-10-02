import { hasL1Subgraph } from '../SubgraphUtils'
import {
  getAPIBaseUrl,
  isExperimentalFeatureEnabled,
  sanitizeQueryParams
} from '../index'

export type FetchEthDepositsToCustomDestinationFromSubgraphResult = {
  receiver: string
  sender: string
  timestamp: string
  transactionHash: string
  type: 'EthDeposit'
  isClassic: false
  id: string
  ethValue: string
  blockCreatedAt: string
}

/**
 * Fetches initiated retryable deposits (ETH transfers to custom destination) from subgraph in range of [fromBlock, toBlock] and pageParams.
 *
 * @param query Query params
 * @param query.sender Address that initiated the deposit
 * @param query.receiver Address that received the funds
 * @param query.fromBlock Start at this block number (including)
 * @param query.toBlock Stop at this block number (including)
 * @param query.l2ChainId Chain id for the L2 network
 * @param query.pageSize Fetch these many records from subgraph
 * @param query.pageNumber Fetch records starting [pageNumber * pageSize] records
 * @param query.searchString Searches records through the l1TxHash
 */

export const fetchEthDepositsToCustomDestinationFromSubgraph = async ({
  sender,
  receiver,
  fromBlock,
  toBlock,
  l2ChainId,
  pageSize = 10,
  pageNumber = 0,
  searchString = ''
}: {
  sender?: string
  receiver?: string
  fromBlock: number
  toBlock?: number
  l2ChainId: number
  pageSize?: number
  pageNumber?: number
  searchString?: string
}): Promise<FetchEthDepositsToCustomDestinationFromSubgraphResult[]> => {
  if (!isExperimentalFeatureEnabled('eth-custom-dest')) {
    return []
  }

  if (toBlock && fromBlock >= toBlock) {
    // if fromBlock > toBlock or both are equal / 0
    return []
  }

  const urlParams = new URLSearchParams(
    sanitizeQueryParams({
      sender,
      receiver,
      fromBlock,
      toBlock,
      l2ChainId,
      pageSize,
      page: pageNumber,
      search: searchString
    })
  )

  if (!hasL1Subgraph(Number(l2ChainId))) {
    throw new Error(`L1 subgraph not available for network: ${l2ChainId}`)
  }

  if (pageSize === 0) return [] // don't query subgraph if nothing requested

  const response = await fetch(
    `${getAPIBaseUrl()}/api/eth-deposits-custom-destination?${urlParams}`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    }
  )

  const transactions: FetchEthDepositsToCustomDestinationFromSubgraphResult[] =
    (await response.json()).data

  return transactions
}