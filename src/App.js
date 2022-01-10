import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Smile from './artifacts/contracts/Smile.sol/Smile.json';
import './App.css';
import img1 from './img/1.png'

const Smileaddress = "0x850B37002F79Fb33148cbc37134dB8Ac655616FC";

function App() {

  const [error, setError] = useState('');
  const [data, setData] = useState({})
  const [account, setAccount] = useState([]);

  useEffect(() => {
    fetchData();
    getAccounts();
  },  [])

  async function getAccounts() {
    if(typeof window.ethereum !== 'undefined') {
      let accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
      setAccount(accounts);
      console.log(accounts[0]);

    }
  }

  async function fetchData() {
    if(typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(Smileaddress, Smile.abi, provider);
      try {
        const cost = await contract.cost();
        const totalSupply = await contract.totalSupply();
        const object = {"cost": String(cost), "totalSupply": String(totalSupply)}
        setData(object);
      }
      catch(err) {
        setError(err.message);
      }
    }
  }

   async function mint() {
    if(typeof window.ethereum !== 'undefined') {
      let accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(Smileaddress, Smile.abi, signer);
      try {
        let overrides = {
          from: accounts[0],
          value: data.cost
        }
        const transaction = await contract.mint(accounts[0], 1, overrides);
        await transaction.wait();
        fetchData();
      }
      catch(err) {
        setError(err.message);
      }
    }
  }

  async function withdraw() {
    if(typeof window.ethereum !== 'undefined') {
      let accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(Smileaddress, Smile.abi, signer);
      try {
        const transaction = await contract.withdraw();
        await transaction.wait();
      }
      catch(err) {
        setError(err.message);
      }
    }
  }


  return (


    <div className="App">
      {account[0] === "0xe503c6465a7440957b2206ac1c914c78e565ea13" && 
      <button className="withdraw" onClick={withdraw}>Withdraw</button>}
  
      <div className="container">
        <div className="banniere">
          <img src={img1} alt="img" /> <button id="myBtn" class="btn"> ? </button> </div>
        {error && <p>{error}</p>}
        <h1>Mint a <span className="txtimportant">Smi-_-le </span>and make the world happier ! </h1>
        <p className="count"><span className="achete">{data.totalSupply}</span> / 500</p>
        <p className="cost">Each Smi-_-le costs <span className="txteth"> {data.cost / 10**18} eth </span> (excluding gas fees)</p>
        <button className="buy" onClick={mint}>BUY</button>


      </div>
    </div>
  );
}

export default App;
