import React, { useEffect, useState } from "react";
import './styles/App.css';
import { ethers } from "ethers";
import NFTGenerator from './utils/NFTGenerator.json';

const OPENSEA_LINK = '';
const TOTAL_MINT_COUNT = 50;

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  
  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);
    } else {
      console.log("No authorized account found");
    }
  }

  /*
  * Implement your connectWallet method here
  */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      /*
      * Fancy method to request access to account.
      */
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      /*
      * Boom! This should print out public address once we authorize Metamask.
      */
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]); 
    } catch (error) {
      console.log(error);
    }
  }

  const askContractToMintNft = async () => {
    const CONTRACT_ADDRESS = "0xCf2199720C18c3f4eaA55B68F5ce14C9b4Bb9c8D";
  
    try {
      const { ethereum } = window;
  
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, NFTGenerator.abi, signer);
  
        console.log("Going to pop wallet now to pay gas...")
        let nftTxn = await connectedContract.createNFT();
  
        console.log("Mining...please wait.")
        await nftTxn.wait();
        
        console.log(`Mined, see transaction: https://goerli.etherscan.io/tx/${nftTxn.hash}`);
  
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const renderNotConnectedContainer = () => (
    <button onClick={connectWallet} className="cta-button connect-wallet-button">
      Connect to Wallet
    </button>
  );

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">The Flag NFT Collection</p>
          <p className="sub-text">
            Each unique. Each beautiful. Claim yours today! Now!!
          </p>
          {currentAccount === "" 
            ? renderNotConnectedContainer()
            : (
              /** Add askContractToMintNft Action for the onClick event **/
              <button onClick={askContractToMintNft} className="cta-button connect-wallet-button">
                Mint NFT
              </button>
            )
          }
        </div>
      </div>
    </div>
  );
};

export default App;