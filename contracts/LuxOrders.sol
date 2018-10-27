pragma solidity ^0.4.24;

import '../openzeppelin-solidity-master/contracts/token/ERC721/ERC721Full.sol';
import "../openzeppelin-solidity-master/contracts/ownership/Ownable.sol";

contract LuxOrders is ERC721Full, Ownable {

  //state variables

    //tokenid index
    uint256 public orderIndex;

    //total raised in sales uint256 USD
    uint256 public totalRaised;

    //total verifiably donated to charities
    uint256 public totalDonated;

    //total amount chosen to be donated
    uint256 public totalChosenDonatedAmount;

    //total number of chosen donations
    uint256 public totalChosenDonations;

    //total number of made donations
    uint256 public totalMadeDonations;

    //token mapping
    mapping (uint256 => OrderToken) public orderTokens;

    //token struct for order -> which represents a sale
    struct OrderToken {
      uint256 saleAmount;
      string tokenURI;
      address generation;
      address owner;
      bool redeemed;
      bytes32 buyerHash;
      bytes32 redemptionHash;
      bool exists; //always true
    }

    //charities mapping to track the total amount chosen to be donated
    //to each charity, id is SHA256(full name of charity)
    mapping (bytes32 => Charity) public charities;
    struct Charity {
      string charityName;
      uint256 amountChosenToDonate;
      uint256 amountDonated;
      bool exists; //always true
    }

    //MadeDonations is a list of donations actually made
    //id is hash of donation IPFS url, indexed by proofHash
    mapping (bytes32 => MadeDonation) public madeDonations;
    struct MadeDonation {
      string charityName; //name of charity luxarity sent proceeds to
      string donationProofUrl;
      uint256 amountDonated; //amount donated via grant to charity
      address donorAddress; //address of owner of contract (luxarity)
    }

    //buyers mapping with buyer struct bytes32 => buyer
    mapping (bytes32 => Buyer) public buyers;
    struct Buyer {
      uint256 totalContributed; //total amount the buyer has bought in USD
      uint256 totalDonationsAllocated; //amount of donation capital allocated
      bool exists; //always true
    }


  //constructor for NFT token, name = Luxarity, symbol = LUX
    constructor() ERC721Full('Luxarity Order Token', 'LUX0') public {
      //tokenid index
      orderIndex = 0;
      //total capital raised uint256 USD
      totalRaised = 0;
      //total donated by luxarity (USD)
      totalDonated = 0;
      //total number of chosen donations
      totalChosenDonations = 0;
      //total number of made donations
      totalMadeDonations = 0;
      //total amount chosen to be donated
      totalChosenDonatedAmount = 0;
    }

  //events
    event SoldAndMintedToken (uint256 _tokenId, bytes32 _buyerID, uint256 _saleAmount, string _tokenURI, address _tokenMinter);
    //event when donation is chosen (bytes32, amount, charityName, donation id)
    event DonationChosen (string _charityName, bytes32 _buyerId, uint256 _amountToBeDonated);
    //event when donation is made by luxarity
    event DonationMadeToCharity (bytes32 _donationHash, uint256 _amountDonated, string _charityName, string _donationURL);
    //event when token is redeemed
    event RedeemedToken (uint256 _tokenId, bytes32 _buyerId, address _buyerAddress);

  //cuase functions

    //mint function - when Orders are sold in an order - the receipt should be tokenized
    function soldOrderToMint(string _tokenURI, uint256 _saleAmount, string _buyerID, string _redemptionHash) public onlyOwner returns (uint) {

      //1.0 Ensure token doesn't already exists
      uint256 testIndex = orderIndex + 1;
      require(_exists(testIndex) == false);

      //create buyerhash and redemption hash
      bytes32 buyerID = keccak256(abi.encodePacked(_buyerID));
      bytes32 redemptionHash = keccak256(abi.encodePacked(_redemptionHash));

      //2.0 check if buyer already exists
      if (!buyers[buyerID].exists) {
        //adding new buyer to buyers mapping
        buyers[buyerID] = Buyer(_saleAmount, 0, true);
      } else {
        //update existing buyer
        buyers[buyerID].totalContributed += _saleAmount;
      }

      //increment total donations
      totalRaised += _saleAmount;

      //increment orderIndex
      orderIndex += 1;

      //create new sale
      orderTokens[orderIndex] = OrderToken(_saleAmount, _tokenURI, msg.sender, msg.sender, false, buyerID, redemptionHash, true);

      //mint token
      _mint(msg.sender, orderIndex);

      //set metadata
      _setTokenURI(orderIndex, _tokenURI);

      //emit event
      emit SoldAndMintedToken(orderIndex, buyerID, _saleAmount, _tokenURI, msg.sender);

      //return
      return orderIndex;

    }

    //chooseDonation function
    function chooseDonation(string _buyerID, string _charityName, uint256 _chosenDonateAmount) public returns (bool) {
      //buyer check to operate function instead of modifier for conversion reasons
      bytes32 buyerID = keccak256(abi.encodePacked(_buyerID));
      require(buyers[buyerID].exists == true);
      //check if amount to donate is less than or equal to the amount left
      uint256 leftover = buyers[buyerID].totalContributed - buyers[buyerID].totalDonationsAllocated;
      //if it is, proceed
      if (leftover >= _chosenDonateAmount) {
        //incement totalChosenDonatedAmount
        totalChosenDonatedAmount += _chosenDonateAmount;
        //increment total number of donations chosen to be made
        totalChosenDonations += 1;
        //update buyers donation allocation
        buyers[buyerID].totalDonationsAllocated += _chosenDonateAmount;
        //check if charity is new
        bytes32 charityHash = keccak256(abi.encodePacked(_charityName));
        //if it is, add to charity mapping
        if (charities[charityHash].exists) {
          charities[charityHash].amountChosenToDonate += _chosenDonateAmount;
        } else {
          //if not, update charity struct
          charities[charityHash] = Charity(_charityName, _chosenDonateAmount, 0, true);
        }
        //emit event ChosenToDonate
        emit DonationChosen(_charityName, buyerID, _chosenDonateAmount);
        //return true
        return true;
      }
      //if it is not, return false
      return false;
    }

    //make donation function
    function makeDonation(string _proofHash, string _proofURL, uint256 _madeDonationAmount, string _charityName) public onlyOwner returns (bool) {
      uint256 leftover = totalRaised - totalDonated;
      require(leftover >= _madeDonationAmount);

      //create proper hash (sha256 of data proof of donation)
      bytes32 proofHash = keccak256(abi.encodePacked(_proofHash));

      //check if donation doesn't exist yet
      require(madeDonations[proofHash].donorAddress == address(0));
      //increment total made donations
      totalMadeDonations += 1;
      //total donated sum amount increased
      totalDonated += _madeDonationAmount;

      //add to made donations mapping
      madeDonations[proofHash] = MadeDonation(_charityName, _proofURL, _madeDonationAmount, msg.sender);
      //emit event
      emit DonationMadeToCharity(proofHash, _madeDonationAmount, _charityName, _proofURL);
      //return
      return true;
    }

    //redeem token
    function redeemOrder(string _buyerID, string _redemptionHash, address _buyerAddress, uint256 _tokenId) public returns (bool) {

      //create buyerhash
      bytes32 buyerID = keccak256(abi.encodePacked(_buyerID));
      require(buyers[buyerID].exists == true);

      //create redemption hash
      bytes32 redemptionHash = keccak256(abi.encodePacked(_redemptionHash));

      //make sure address is valid
      require(orderTokens[_tokenId].exists == true);
      require(_buyerAddress != address(0));
      require(orderTokens[_tokenId].buyerHash == buyerID);
      require(orderTokens[_tokenId].redemptionHash == redemptionHash);

      orderTokens[_tokenId].owner = _buyerAddress;
      orderTokens[_tokenId].redeemed = true;
      //conduct transfer from Luxarity to address
      transferFrom(msg.sender, _buyerAddress, _tokenId);
      //emit event
      emit RedeemedToken(_tokenId, buyerID, _buyerAddress);
      return true;
    }

    //safe redeem token
    function safeRedeemOrder(string _buyerID, string _redemptionHash, address _buyerAddress, uint256 _tokenId) public returns (bool) {
      //create buyerhash
      bytes32 buyerID = keccak256(abi.encodePacked(_buyerID));
      require(buyers[buyerID].exists == true);

      //create redemption hash
      bytes32 redemptionHash = keccak256(abi.encodePacked(_redemptionHash));

      //make sure address is valid
      require(orderTokens[_tokenId].exists == true);
      require(_buyerAddress != address(0));
      require(orderTokens[_tokenId].buyerHash == buyerID);
      require(orderTokens[_tokenId].redemptionHash == redemptionHash);

      orderTokens[_tokenId].owner = _buyerAddress;
      orderTokens[_tokenId].redeemed = true;
      //conduct transfer from Luxarity to address
      safeTransferFrom(msg.sender, _buyerAddress, _tokenId);
      //emit event
      emit RedeemedToken(_tokenId, buyerID, _buyerAddress);
      return true;
    }

  //call functions
    //get how much a buyer has donated in total
    function getBuyerAmount(string _buyerID) public view returns (uint256 total) {
      //create buyerhash
      bytes32 buyerID = keccak256(abi.encodePacked(_buyerID));
      if (buyers[buyerID].exists) {
        return buyers[buyerID].totalContributed;
      }
      return 0;
		}

    //get boolean to see if NFT has been redeemed or not
    function getRedemption(uint _tokenId) public view returns (bool) {
      return orderTokens[_tokenId].redeemed;
		}

    //get token ownerOf
    function getTokenOwner(uint _tokenId) public view returns (address) {
      address owner = ownerOf(_tokenId);
      return owner;
    }

    //transfer ownership of contract
    function transferContract(address newOwner) public onlyOwner {
      transferOwnership(newOwner);
    }

    //fallback
	  function() payable public { }
}
