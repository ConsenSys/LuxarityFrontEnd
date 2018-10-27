import React, { Component } from 'react'
//componets
import Grid from '@material-ui/core/Grid'
import SupportModal from '../projectcard/SupportModal'
//img
import AllImg from '../../img/tripleFashion.png'

class SupportACauseSection extends Component {

  constructor(props, context) {
    super(props)

    /* local state variables */
    this.state = {
    }

    //bind functions
    this.getDonateTotal = this.getDonateTotal.bind(this)
    this.formatNum = this.formatNum.bind(this)
    this.splitTotal = this.splitTotal.bind(this)
  }

  splitTotal(x,y) {
    let sum = x - y
    let donateAmount = sum/3
    let final = Math.max( Math.round(donateAmount * 10) / 10, 2.8 ).toFixed(2)
    return final
  }

  formatNum(x) {
    if (x !== null && x !== 0) {
      let string = x + ""
      let firstNum =  string.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      return "$" + firstNum
    }
    return "$0"
  }

  getDonateTotal(x,y) {
    let sum = x - y
    return this.formatNum(sum)
  }

  render() {
    return(
      <div>
        <div className="dashboard-main">
          <Grid container>
            <Grid item xs={12} sm={6} className="dashboard-main-info">
              <div className="dashboard-main-info-l">
                <p className="dashboard-title">Support a cause</p>
                <p className="dashboard-text">Choose to donate to one or all of these causes. Luxarity will keep in touch with you with updates on their progress over the next few months.</p>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} className="dashboard-main-info">
              <div className="dashboard-main-info-l">
                <div className="cause-donation">
                  <p>Purchase total: <span className="p-tot-amt">{this.formatNum(this.props.totalOrder)}</span> </p>
                  <p>Luxarity fee: <span className="lux-fee">{this.formatNum(this.props.feeAmount)}</span> </p>
                  <hr/>
                  <p className="d-tot">Donation total: <span className="d-tot-amt">{this.getDonateTotal(this.props.totalOrder, this.props.feeAmount)}</span> </p>
                </div>

                <button className="p-btn-clear" onClick={this.props.splitDonation}>Split my donation evenly</button>
              </div>
            </Grid>
          </Grid>
        </div>
        <SupportModal
          type={'split'}
          open={this.props.supportOpen}
          onDonate={this.props.handleDonate}
          handleClose={this.props.handleClose}
          overlayColor={'#CFDBD2'}
          orgs={this.props.orgs}
          donationAmount={this.splitTotal(this.props.totalOrder, this.props.feeAmount)}
          donationImage={AllImg} />
       </div>
    )
  }
}

export default SupportACauseSection
