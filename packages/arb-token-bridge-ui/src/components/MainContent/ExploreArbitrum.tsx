import { useState } from 'react'
import { ExternalLinkIcon } from '@heroicons/react/outline'

import { Button } from '../common/Button'
import { ExternalLink } from '../common/ExternalLink'
import { preloadImages } from '../../util'

import ExploreArbitrumContent from './ExploreArbitrumContent.json'

preloadImages([
  ...ExploreArbitrumContent.defi.map(p => p.imageSrc),
  ...ExploreArbitrumContent.nfts.map(p => p.imageSrc)
])

function getRandomInt({
  from,
  to,
  except
}: {
  from: number
  to: number
  except?: number
}): number {
  from = Math.ceil(from)
  to = Math.floor(to)

  const randomInt = Math.floor(Math.random() * (to - from + 1)) + from

  if (typeof except !== 'undefined' && randomInt === except) {
    return getRandomInt({ from, to, except })
  }

  return randomInt
}

function ProjectCard({
  name,
  description,
  href,
  imageSrc
}: {
  name: string
  description: string
  href: string
  imageSrc: string
}) {
  return (
    <ExternalLink
      href={href}
      className="transition-explore-arbitrum-project-image arb-hover flex h-72 flex-col justify-between rounded-xl bg-gray-4 bg-cover bg-center"
      style={{ backgroundImage: `url(${imageSrc}` }}
    >
      <div className="flex flex-grow items-center justify-between">
        <span className="text-explore-arbitrum-project-name pl-8 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
          {name}
        </span>

        <div className="self-start p-4">
          <ExternalLinkIcon className="h-6 w-6 text-blue-arbitrum" />
        </div>
      </div>
      <div className="bg-explore-arbitrum-project-description flex flex-row justify-between space-x-2 rounded-bl-xl rounded-br-xl p-4">
        <p className="self-center font-light text-white">{description}</p>
        <img
          src="/images/Arbitrum_Symbol_-_Full_color_-_White_background.svg"
          alt="Arbitrum"
          className="h-8 self-end"
        />
      </div>
    </ExternalLink>
  )
}

const defiMaxIndex = ExploreArbitrumContent.defi.length - 1
const nftMaxIndex = ExploreArbitrumContent.nfts.length - 1

export function ExploreArbitrum() {
  const [defiProjectIndex, setDefiProjectIndex] = useState(
    getRandomInt({ from: 0, to: defiMaxIndex })
  )
  const [nftProjectIndex, setNFTProjectIndex] = useState(
    getRandomInt({ from: 0, to: nftMaxIndex })
  )

  function randomize() {
    setDefiProjectIndex(
      getRandomInt({ from: 0, to: defiMaxIndex, except: defiProjectIndex })
    )
    setNFTProjectIndex(
      getRandomInt({ from: 0, to: nftMaxIndex, except: nftProjectIndex })
    )
  }

  const defiProject = ExploreArbitrumContent.defi[defiProjectIndex]
  const nftProject = ExploreArbitrumContent.nfts[nftProjectIndex]

  return (
    <div className="w-full bg-white lg:rounded-xl">
      <div className="bg-blue-arbitrum p-6 lg:rounded-tl-xl lg:rounded-tr-xl">
        <p className="text-2xl text-white">
          While your transaction executes, check out what’s poppin’ in the
          Arbitrum ecosystem
        </p>
      </div>
      <div className="grid grid-cols-1 gap-8 pt-6 sm:grid-cols-2 sm:gap-0">
        <div className="flex flex-col space-y-4 px-6">
          <p className="text-xl font-medium text-blue-arbitrum">
            Invest your crypto in DeFi
          </p>
          <ProjectCard {...defiProject} />
        </div>
        <div className="flex flex-col space-y-4 px-6">
          <p className="text-xl font-medium text-blue-arbitrum">
            Get some dope NFTs
          </p>
          <ProjectCard {...nftProject} />
        </div>
      </div>

      <div className="flex w-full justify-center py-6">
        <Button
          variant="primary"
          onClick={randomize}
          className="bg-blue-arbitrum px-8 text-2xl"
        >
          Randomize ✨
        </Button>
      </div>
    </div>
  )
}
