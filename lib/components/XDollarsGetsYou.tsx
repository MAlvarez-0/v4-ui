import { useTicketDecimals } from 'lib/hooks/Tsunami/PrizePool/useTicketDecimals'
import { useEstimatedOddsForDepositAmount } from 'lib/hooks/Tsunami/useEstimatedOddsForDepositAmount'
import { getAmountFromString } from 'lib/utils/getAmountFromString'
import React from 'react'
import { Trans } from 'react-i18next'

interface XDollarsGetsYouProps
  extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement> {
  x: string
}

export const XDollarsGetsYou = (props: XDollarsGetsYouProps) => {
  const { x, ...spanProps } = props
  const { data: decimals, isFetched } = useTicketDecimals()
  const { data: odds } = useEstimatedOddsForDepositAmount(
    isFetched ? getAmountFromString(x, decimals) : undefined
  )

  console.log(odds)

  return (
    <span {...spanProps}>
      <Trans
        i18nKey='xDollarsGetsYouOdds'
        values={{ dollars: x, odds: odds?.oneOverOdds?.toFixed(2) || '--' }}
        components={{ style1: <b className='' />, style2: <b /> }}
      />
    </span>
  )
}

XDollarsGetsYou.defaultProps = {
  x: '10'
}
