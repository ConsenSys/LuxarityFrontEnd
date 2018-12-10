# LUXARITY Pop-up DApp
The purpose of this application is to track the resale of donated luxury goods from the point of sale to grant disbursement. In addition, the project serves as a proof-of-concept looking to develop a tokenized market place of retail products to incentivize the creation of a prosumer economy, where consumers are rewarded for selling and buying second hand goods. 

A full report on the performance, shortfalls, and overall next steps for the proof-of-concept can be found here: 
https://docs.google.com/document/d/1sdZvbkZ835qVS34oggHoaaXXHPtfy9l7uJPxKCBVp7w/edit#

As an overview, the PoC LUXARITY DApp has the following architectural specs: 

![Architecture View](https://github.com/ConsenSys/LuxarityFrontEnd/blob/master/ReadMeImgs/Architecture/LuxArch.png)

To better understand the architecture of the build, please review the following document: 
- LUXARITY Architecture: https://drive.google.com/a/consensys.net/file/d/1d0Rcb3DFzxKAiHnq154MQPTBoBKbu0W-/view?usp=sharing

## Application Folder Structure
The application has the following folder structure (for the purpose of consiceness, we will not be showing the individual files in this visualization, only the folders and their respective definitions): 

    .
    ├── config                  # Configuration folder packaged with the Truffle Drizzle Box
    │   ├── jest    
    │   └── ...           
    ├── contracts               # Holds smart contracts and ABI for the DAPP (folders provided by Drizzle Box)
    │   └── ...                
    ├── migrations              # Holds files that migrate on-Dapp smart contracts onto the blockchain network (deploy)
    │   └── ...                 
    ├── public                  # Holds favicon (search tab icon logo) and index.html (app page) for application
    │   └── ...                  
    ├── ReadMeImgs              # Hold all representative images of application views and components for repo ReadMe
    │   ├── Architecture          # Images for architecture 
    │   ├── Layouts               # Images for layouts
    │   └── Modal Components      # Images for modal components
    ├── scripts                 # Scripts folder packaged with the drizzle box provided by Truffle
    │   └── ...                
    ├── src                     # Holds all core application files for UI
    │   ├── layouts             # Holds all application views, components, and logic for the front end (UI)
    │   │   ├── views             # Application UI web pages
    │   │   ├── fonts             # Fonts for application
    │   │   ├── componets         # Application components that make up UI web pages
    │   │   └── img               # Application images (logos, etc) that are pertinent to app 
    │   ├── css                 # Application css folder 
    │   ├── fonts               # Application fonts folder
    │   ├── util                # Application utilites folder provided by Drizzle box 
    │   └── ...                
    └── ...


## Application Testing
The majority of testing resources can be found in the Luxarity Smart Contract repository (see below in the Additional Repositories section). The main test can be found in the 'Tests' folder within the LuxOrders.js file. The tests ensure that the smart contract for the application is secure, well-functioning given edge use cases, and accounts for future functionality (or parameters) that may be needed. 

## Additional Repositories
Additional repositories that are critical to the proof of concept can be found below: 

- Front End Application: https://github.com/ConsenSys/LuxarityFrontEnd
- Smart Contract API: https://github.com/ConsenSys/Luxarity-SensuiMod 
- Shopify Event Watcher: https://github.com/ConsenSys/luxarity-shopify 
- Off-Chain API: https://github.com/ConsenSys/luxarity-offchain 
- Luxarity Smart Contracts & Tests: https://github.com/ConsenSys/LuxToken
