import "./App.css";
import { useState, useEffect } from "react";
import { CompanyManagementContract } from "./abi/abis";
import { useForm } from "react-hook-form";
import Web3 from "web3";
import "bootstrap/dist/css/bootstrap.min.css";
import forwarderOrigin from "@metamask/onboarding";
import MetaMaskOnboarding from "@metamask/onboarding";

const web3 = new Web3(Web3.givenProvider);

//contract address
const contractAddr = "0xc65ACaEcF093de732BC96f4BD5bEb838bA16aC60";
const SimpleContract = new web3.eth.Contract(
  CompanyManagementContract,
  contractAddr
);

//TO DO : MAKE A CONNECT WALLET BUTTON, WHICH LET'S YOU CONNECT TO METAMASK --DONE
//IT WAS SHOWS THE ADDRESS YOU ARE CONNECTED WITH

function App() {
  const { register, handleSubmit } = useForm();

  const [length, setLength] = useState(0);
  const [account, setAccount] = useState(0);
  const [companyList, setCompanyList] = useState([]);
  const [go, setGo] = useState(0);
  const [metaMaskConnected, setMetaMaskConnected] = useState();
  const { ethereum } = window;
  console.log(CompanyManagementContract);
  //Checkign if metaMask is installed
  const isMetaMaskInstalled = () => {
    //Have to check the ethereum binding on the window object to see if it's installed
    const { ethereum } = window;

    return ethereum.isMetaMask;
  };
  //Connecting to wallet
  const connectWallet = async () => {
    try {
      // Will open the MetaMask UI
      // You should disable this button while the request is pending!
      await ethereum.request({ method: "eth_requestAccounts" });
    } catch (error) {
      console.error(error);
    }
  };

  //Redirecting user to metaMask extension
  const redirectToMetaMaskExtension = () => {
    const onboarding = new MetaMaskOnboarding({ forwarderOrigin });

    //This will start the onboarding proccess
    const onClickInstall = () => {
      //On this object we have startOnboarding which will start the onboarding process for our end user
      onboarding.startOnboarding();
    };
    onClickInstall();
  };

  useEffect(async () => {
    //Checking if metaMask wallet is installed

    const accounts = await window.ethereum.enable();
    setAccount(accounts[0]);
  }, []);
  console.log(account);

  const addCompany = async (data) => {
    console.log(data);
    await SimpleContract.methods
      .setCompany(
        data.status,
        data.linkLogo,
        data.companyName,
        data.apiProduct,
        data.apiQuote
      )
      .send({ from: account });
  };

  const displayCompanies = async (e) => {
    //getting length of company list
    const listLength = await SimpleContract.methods
      .getIdxLength()
      .call({ from: account });
    setLength(listLength);
    console.log(listLength);
    // await SimpleContract.methods;

    //getting each company and storing it's data
    // for (var i = 0; i < listLength; i++) {
    const company = await SimpleContract.methods
      .getCompany(0)
      .call({ from: account });

    console.log(company);
    console.log(account);
    //   .getCompany(1)
    //   .call({ from: account });
    // console.log(company);
    //companyList.push(company);
    // setCompanyList(companyList);
    //}
    // setGo(1);
  };

  const updateCompanyStatus = () => {};

  console.log(length);
  console.log(companyList);

  return (
    <div className="App">
      <h2>Company Management System</h2>
      {/*Button to connect metaMask wallet*/}
      {isMetaMaskInstalled() && (
        <button className="btn btn-light" onClick={connectWallet}>
          Connect
        </button>
      )}
      {!isMetaMaskInstalled() && (
        <button className="btn btn-light" onClick={redirectToMetaMaskExtension}>
          Install metaMask
        </button>
      )}
      {/*form to add a company */}
      <form onSubmit={handleSubmit(addCompany)}>
        <br />
        <input placeholder="Company Name" {...register("companyName")} />
        <br />
        <input placeholder="Logo Link" {...register("linkLogo")} />
        <br />
        <input
          placeholder="Product List API"
          {...register("apiProduct")}
        />{" "}
        <br />
        <input placeholder="Product Quote API" {...register("apiQuote")} />{" "}
        <br />
        <select {...register("status")}>
          <option value="0">ACTIVE </option>
          <option value="4">JOINING VERY SOON</option>
        </select>
        <br />
        <input className="btn btn-dark rounded-0 m-1" type="submit" />
        <br />
      </form>
      <button className="btn btn-dark rounded-0" onClick={displayCompanies}>
        get Company List
      </button>
      {/* <div>
        Company list :
        <div className="card-group">
          {go &&
            companyList.map((com, idx) => {
              return (
                <div key={idx} className="flex" id="cardIndividual">
                  <div className="card text-white bg-dark p-0 rounded-0">
                    <div className="card-body">
                      <div className="img">
                        <img
                          className="card-img"
                          src="https://defitech.net/wp-content/uploads/2020/10/DeFi-Logo-GSuite-01.png"
                        />
                      </div>
                      <h5 className="card-title">{com[1]}</h5>
                      <p className="card-text">
                        {com[0]}
                        <br></br>
                        status
                      </p>

                      <button
                        href="#"
                        className="btn btn-info rounded-0"
                        onClick={updateCompanyStatus}
                      >
                        Update
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div> */}
    </div>
  );
}
