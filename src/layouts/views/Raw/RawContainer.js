import Raw from './Raw'
//bindors and connectos
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { drizzleConnect } from 'drizzle-react'
//redux actions
import { chooseDonation } from '../../../redux/chooseDonation/actions'
import { makeDonation } from '../../../redux/makeDonation/actions'
import { redeemOrder } from '../../../redux/redeemOrder/actions'
import { safeRedeemOrder } from '../../../redux/safeRedeemOrder/actions'

// connectors for API
const mapStateToProps = state => ({
  choosingDonation: state.chooseDonation.running,
  choseDonation: state.chooseDonation.response !== null,
  chooseDonationError: state.chooseDonation.error,
  chooseDonationSuccess: state.chooseDonation.success,

  makingDonation: state.makeDonation.running,
  madeDonation: state.makeDonation.response !== null,
  makeDonationError: state.makeDonation.error,
  makeDonationSuccess: state.makeDonation.success,

  redeemingOrder: state.redeemOrder.running,
  redeemedOrder: state.redeemOrder.response,
  redeemOrderError: state.redeemOrder.error,
  redeemOrderSuccess: state.redeemOrder.success,

  safeRedeemingOrder: state.safeRedeemOrder.running,
  safeRedeemedOrder: state.safeRedeemOrder.response,
  safeRedeemOrderError: state.safeRedeemOrder.error,
  safeRedeemOrderSuccess: state.safeRedeemOrder.success,
})

const mapDispatchToProps = dispatch => bindActionCreators({
  chooseDonation,
  makeDonation,
  redeemOrder,
  safeRedeemOrder,
}, dispatch)

// May still need this even with data function to refresh component on updates for this contract.
//for more on what the hell this is, check out here: https://github.com/trufflesuite/drizzle
const mapDrizzleStateToProps = state => {
  return {
    accounts: state.accounts,
    drizzleStatus: state.drizzleStatus,
    web3: state.web3,
  }
}

const RawContainer = drizzleConnect(connect(mapStateToProps, mapDispatchToProps)(Raw), mapDrizzleStateToProps);

export default RawContainer
