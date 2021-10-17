import React, { useMemo, useState } from 'react'
import { PrizeDistributor, PrizePool } from '@pooltogether/v4-js-client'
import { useTranslation } from 'react-i18next'

import { useUnclaimedDrawsAndPrizeDistributions } from 'lib/hooks/Tsunami/PrizeDistributor/useUnclaimedDrawsAndPrizeDistributions'
import { useUsersPrizePoolBalances } from 'lib/hooks/Tsunami/PrizePool/useUsersPrizePoolBalances'
import { getPrettyDate } from 'lib/utils/date'
import { DrawCard } from './DrawCard'
import { DrawCarousel } from './DrawCarousel'
import { SquareButtonSize, SquareButtonTheme, SquareLink } from '@pooltogether/react-components'
import Link from 'next/link'
import { useRouter } from 'next/router'

interface PrizeDistributorDrawListProps {
  prizeDistributor: PrizeDistributor
  prizePool: PrizePool
}

export const PrizeDistributorDrawList = (props: PrizeDistributorDrawListProps) => {
  const { prizeDistributor, prizePool } = props
  const { t } = useTranslation()
  const {
    error,
    data: drawsAndPrizeDistributions,
    isFetched
  } = useUnclaimedDrawsAndPrizeDistributions(prizeDistributor)
  const {
    data: usersBalances,
    refetch: refetchUsersBalances,
    isFetched: isUsersBalancesFetched
  } = useUsersPrizePoolBalances(prizePool)
  const [drawIdsToHideThisSession, setDrawIdsToHideThisSession] = useState([])
  const router = useRouter()

  // Filter out manually hidden draw ids from this session
  let drawsAndPrizeDistributionsToRender = useMemo(
    () =>
      drawsAndPrizeDistributions?.filter(
        (drawAndPrizeDistribution) =>
          !drawIdsToHideThisSession.includes(drawAndPrizeDistribution.draw.drawId)
      ) || [],
    [drawsAndPrizeDistributions, drawIdsToHideThisSession]
  )

  // drawsAndPrizeDistributionsToRender = drawsAndPrizeDistributionsToRender.slice(0, 10)

  const drawsAndPrizeDistributionsLength = drawsAndPrizeDistributionsToRender?.length
  const drawsAndPrizeDistributionsToRenderSliced =
    drawsAndPrizeDistributions?.slice(
      drawsAndPrizeDistributionsLength - 10,
      drawsAndPrizeDistributionsLength
    ) || []

  if (!isFetched || !isUsersBalancesFetched) {
    return <LoadingCard />
  }

  if (isFetched && drawsAndPrizeDistributionsToRender.length === 0) {
    return (
      <div className='flex flex-col justify-center purple-radial-gradient text-center text-accent-1 mx-auto px-2 max-w-xl mb-4 h-48 xs:h-112'>
        {usersBalances.ticket.hasBalance && (
          <>
            <span className='mt-10 text-xl text-inverse'>
              {t('noDrawsToCheck', 'No draws to check!')}
            </span>
            <span className='mb-10'>{t('comeBackSoon', 'Come back soon')}</span>
          </>
        )}
        {!usersBalances.ticket.hasBalance && (
          <>
            <span className='mt-10 text-xl text-inverse'>
              {t('noDrawsToCheckNoDeposits', 'No draws to check!')}
            </span>
            <span className='mb-2'>
              {t('depositToBeEligible', 'Make a deposit for a chance to win')}
            </span>
            <SquareLink
              Link={Link}
              size={SquareButtonSize.sm}
              theme={SquareButtonTheme.tealOutline}
              href={{ pathname: '/deposit', query: router.query }}
              className='mt-4 mb-8 items-center block xs:inline mx-auto w-32'
            >
              {t('deposit')}
            </SquareLink>
          </>
        )}
      </div>
    )
  }

  return (
    <div className='max-w-5xl mx-auto'>
      <DrawCarousel>
        {drawsAndPrizeDistributionsToRenderSliced.map((drawAndPrizeDistribution) => (
          <div
            className='mx-auto pb-12 flex justify-center'
            key={`${prizeDistributor.id()}_${drawAndPrizeDistribution.draw.drawId}`}
          >
            <div className='draw-card-container max-w-xl px-2'>
              <DrawCard
                prizeDistributor={prizeDistributor}
                draw={drawAndPrizeDistribution.draw}
                drawLock={drawAndPrizeDistribution.drawLock}
                prizeDistribution={drawAndPrizeDistribution.prizeDistribution}
                hideDrawCard={() =>
                  setDrawIdsToHideThisSession((drawsToHide) => [
                    ...drawsToHide,
                    drawAndPrizeDistribution.draw.drawId
                  ])
                }
                refetchUsersBalances={refetchUsersBalances}
              />
            </div>
          </div>
        ))}
      </DrawCarousel>
    </div>
  )
}

const LoadingCard = (props) => (
  <div className='w-full max-w-xl px-2 mb-12 mx-auto'>
    <div className='w-full rounded-xl animate-pulse bg-card mb-4 h-48 xs:h-112 mx-auto' />
  </div>
)
