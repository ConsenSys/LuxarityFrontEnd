import React, { Component } from 'react'
import PropTypes from 'prop-types'
//resources
import web3Utils from 'web3-utils'
import Web3 from 'web3'
import { sha256 } from 'js-sha256'
import LuxOrder from '../../../../build/contracts/LuxOrders.json'
//css components
import { Row } from 'react-grid-system'
import Loadable from 'react-loading-overlay'
import { Redirect, withRouter } from 'react-router-dom'; //v4
//components
import Wrapper from '../../components/wrapper/WrapperContainer'
import EnterPinSection from '../../components/sections/EnterPinSection'
import LuxarityIsMoreSection from '../../components/sections/LuxarityIsMoreSection'
import MessageModal from '../../components/userfeedback/MessageModal'
import ProjectSkinnyCard from '../../components/projectcard/ProjectSkinnyCard'
//tempData
import testData from '../Support/tempData/data.json'
//images
import GreenImg from '../../img/Green.png'
import TanImg from '../../img/Tan.png'
import BlueImg from '../../img/Blue.png'
import AllImg from '../../img/tripleFashion.png'

class Redeem extends Component {
  constructor(props, context) {
    super(props)

    /* local state variables */
    this.state = {
      pinValue: '',
      messageModal: false,
      contract: null,
      charitiesAllocated: []
    }

    //bind functions
    this.setPinValue = this.setPinValue.bind(this)
    this.enterPin = this.enterPin.bind(this)
    this.handleClose = this.handleClose.bind(this)
  }

  async componentDidMount() {
    //get web3 instance
    let web3 = await new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/dafcac3faf174e009483337759967f85"))

    //get abi information
    let abi = LuxOrder.abi
    let contract = await new web3.eth.Contract(abi, "0xa4c69450f2dea4a10a7e799674feda99c9af9732")

    //get already chosen allocated amounts for each charity
    let charitiesAllocated = []
    for (let i = 0; i < testData.length; i++) {
      let charityHash = web3Utils.keccak256(testData[i].charityName)
      await contract.methods.charities(charityHash).call(function(err, res){
        if (err) {
          charitiesAllocated.push(0)
        }
        else {
          console.log(res)
          charitiesAllocated.push(Number(res.amountChosenToDonate))
        }
      })
    }

    //extra use case (both)
    console.log(charitiesAllocated)
    let charityHashSplit = web3Utils.keccak256(testData[0].charityName + "," + testData[2].charityName)
    await contract.methods.charities(charityHashSplit).call(function(err, res){
      if (err || !res.exists) {
        charitiesAllocated.push(0)
      } else {
        console.log(res.amountChosenToDonate/2)
        charitiesAllocated[0] += Number(res.amountChosenToDonate/2)
        charitiesAllocated[2] += Number(res.amountChosenToDonate/2)
      }
    })

    //update state
    await this.setState({
      contract: contract,
      charitiesAllocated: charitiesAllocated,
    })
  }

  componentDidUpdate(prevProps, prevState) {
    //not as important to save to state so might change in the future 9/23/18
    if (prevProps.getOrderByRedemError.length === 0 && this.props.getOrderByRedemError.length > 0) {
      this.setState({ messageModal: true })
    }
  }

  async enterPin(event) {
    //prevent default after press
    event.preventDefault();
    //prepare data
    let pinString = this.state.pinValue.toString()
    let pinHash = sha256(pinString)
    console.log(pinHash)
    //need to replace with actual entry data**
    await this.props.getOrderByRedemptionHash(pinHash.toUpperCase())
  }

  setPinValue(pin) {
    console.log(pin)
    this.setState({ pinValue: pin })
  }

  handleClose() {
    this.setState({ messageModal: false })
  }

  mapSections(data) {
    const gridItems = data.map((datum, index) => {

      //select image
      let image
      let pledge
      if (index === 0) {
        image = GreenImg
        pledge = this.state.charitiesAllocated[index]
      } else if (index === 1) {
        image = TanImg
        pledge = testData[1].charityPledge
      } else if (index === 2) {
        image = BlueImg
        pledge = this.state.charitiesAllocated[index]
      }

      return (
        <ProjectSkinnyCard
          key={index}
          cardCategory={datum.charityCategory}
          cardOrgName={datum.charityName}
          cardPledged={pledge}
          charityImage={image}
          cardGoal={datum.charityGoal} />
      );
    });

    return (
      <Row style={{padding: 0, margin: 0, alignItems: 'center', justifyContent: 'center'}}>{gridItems}</Row>
    )
  }

  render() {
    if (this.props.getOrderByRedemSuccess && this.props.gotOrderByRedem !== null) {
      return (
        <Redirect
          to={{
            pathname: `/support/${this.props.gotOrderByRedem[0].orderid}`,
            state: {
              orderId: this.props.gotOrderByRedem[0].orderid,
              orderNumber: this.props.gotOrderByRedem[0].ordernumber,
              totalcost: this.props.gotOrderByRedem[0].totalcost,
              customeremail: this.props.gotOrderByRedem[0].customeremail,
            }
          }}
        />
      );
    }

    return (
        <Wrapper>
          <div>
            <Loadable
              active={this.props.gettingOrderByRedem}
              spinner
              text={"Checking for order..."}>
              <Row style={{backgroundColor: '#F1F2F3', alignItems: 'center', justifyContent: 'center', paddingTop: 50, paddingBottom: '3%', paddingLeft: 50, paddingRight: 5, margin: 0}}>
                <EnterPinSection enterPin={this.enterPin} setPinValue={this.setPinValue} />
              </Row>
            </Loadable>

            <Loadable
              active={this.state.charitiesAllocated.length === 0}
              spinner
              text={"Loading charities..."}>
              <div style={{alignItems: 'center', justifyContent: 'center'}}>
                <div style={{fontSize: 40, textAlign: 'center', padding: '100px 0 100px 0'}}>R.A.W. Grant Partners</div>
                {this.mapSections(testData)}
              </div>
            </Loadable>

            <LuxarityIsMoreSection />
            <MessageModal
              open={this.state.messageModal}
              handleClose={this.handleClose}
              overlayColor={'#bec0be'}
              messageImage={AllImg}
              cardTitle={"Oops! Wrong Pin!"}
              cardSubtitle={"Please try again."}
              cardMessage={"This doesn't quite match any pin codes on record. Please try again and make sure there aren't any rogue spaces or letters in your entry."} />
          </div>
        </Wrapper>
    )
  }
}

Redeem.contextTypes = {
  drizzle: PropTypes.object
}

export default withRouter(Redeem)
