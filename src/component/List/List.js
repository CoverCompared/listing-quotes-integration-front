import { useState, useEffect } from "react";
import { CompanyManagementContract } from "../../abi/abis";
import { useForm } from "react-hook-form";
import Web3 from "web3";
import "bootstrap/dist/css/bootstrap.min.css";
import forwarderOrigin from "@metamask/onboarding";
import MetaMaskOnboarding from "@metamask/onboarding";
import axios from "axios";

const web3 = new Web3(Web3.givenProvider);

//contract address
const contractAddr = "0x94669358a1E8A900ddC439D7eAA5bD8633f70f55";
const SimpleContract = new web3.eth.Contract(
  CompanyManagementContract,
  contractAddr
);

export function List() {
  const { register, handleSubmit } = useForm();
  const [account, setAccount] = useState();
  const [productLength, setProductLength] = useState(0);
  const [apiProductList, setApiProductList] = useState([]);
  const [chosenProduct, setChosendProduct] = useState([]);
  const [productsToDisplay, setProductsToDisplay] = useState([]);
  const [productNameMapping, setProductNameMapping] = useState([]);
  const [productnameTemp, setProductNameTemp] = useState([]);
  const [quoteForm, setQuoteForm] = useState(false);
  const [quoteProduct, setQuoteProduct] = useState(false);

  //Add this on blockchain
  const searchBarArray = [
    "Compound V2",
    "Aave V2",
    "Maker",
    "Uniswap V2",
    "Bancor",
    "Curve",
    "Yearn",
    "Balancer v1",
    "Nexus Mutual",
    "RenVM",
    "1inch",
    "Badger DAO",
    "Loopring",
    "B Protocol",
    "Balancer v2",
    "SushiSwap",
    "BoringDAO",
    "dHEDGE",
    "88mph V2",
    "Dodo",
    "Unagii",
    "KeeperDAO",
  ];

  useEffect(async () => {
    const address = await window.ethereum.enable();

    setAccount(address[0]);
  }, []);

  const listCompany = async () => {
    const listLength = await SimpleContract.methods
      .getIdxLength()
      .call({ from: account });
    console.log(listLength);

    for (var i = 0; i < listLength; i++) {
      const company = await SimpleContract.methods
        .getCompany(i)
        .call({ from: account });

      console.log(company);
      apiProductList.push(company[3]);
      setApiProductList(apiProductList);
    }
    getProductList();
  };

  const getProductList = async () => {
    for (var i = 0; i < apiProductList.length; i++) {
      const data = await axios.get(apiProductList[i]);
      console.log(data);

      setProductLength(+productLength + data.data.result.count);

      for (var m = 0; m < data.data.result.count; m++) {
        if (data.data.result.list[m].name == chosenProduct[0]) {
          console.log(data.data.result.list[m]);
          productsToDisplay.push(data.data.result.list[m]);
          setProductsToDisplay(productsToDisplay);
          return data.data.result.list[m];
        }
      }

      productnameTemp.push(...data.data.result.list);
      setProductNameTemp(productnameTemp);
    }
    productNameMapping.push(...productnameTemp);
    setProductNameMapping(productNameMapping);
    console.log(productLength);
    // const data = await axios.get(apiProductList[0]);
    // console.log(data.data.result);
  };
  const performSearch = async (data) => {
    setChosendProduct([data.name]);
    listCompany();
  };
  console.log(chosenProduct);
  // console.log(chosenProduct);
  // console.log(searchBar);
  // console.log(productNameMapping);
  console.log(productsToDisplay);

  const getQuote = async (data) => {
    data.product = searchBarArray.indexOf(data.product) + 1;
    data.amount = +data.amount * 10 ** 18;

    data.period = +data.period;

    data.currency = 0;
    console.log(data);

    const quote = await axios.post("https://api.nsure.network/v1/get_quote", {
      data,
    });
    console.log(quote);
  };

  const getQuoteTest = async () => {
    // const data = {
    //   name: "yahao",
    //   product: +a.product,
    //   amount: +a.amount * 10 ** 18,
    //   period: +a.period,
    //   currency: 0,
    // };

    const data = {
      name: "yahao",
      product: "5",
      amount: "2000000000000000000",
      period: "30",
      currency: "0",
    };
    console.log(data);
    const quote = await axios.post(
      "https://api.nsure.network/v1/get_quote",
      data
    );
    console.log(quote);
  };

  return (
    <div>
      {/* Listing all the product Names */}
      {/* <div className="card-group">
        {productNameMapping.map((product, idx) => {
          return (
            <div key={idx} className="flex" id="cardIndividual">
              <div className="card-body bg-light">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text">
                  Securtiy Rating : {product.securityRating} <br />
                  Rate : {product.rate}
                </p>

                <button href="#" className="btn btn-light border rounded-0">
                  Get quote
                </button>
              </div>
            </div>
          );
        })}
      </div> */}
      <form key={1} onSubmit={handleSubmit(performSearch)}>
        <select {...register("name")}>
          {searchBarArray.map((field, idx) => {
            return <option value={field}>{field}</option>;
          })}
        </select>
        <input type="submit" className="btn btn-light rounded-0" />
      </form>

      {productsToDisplay && (
        <div className="card-group">
          {productsToDisplay.map((a, i) => {
            return (
              <div key={i} className="flex" id="cardIndividual">
                <div className="card-body bg-light">
                  <h5 className="card-title">{a.name}</h5>
                  <p className="card-text">
                    Securtiy Rating : {a.securityRating} <br />
                    Rate : {a.rate}
                  </p>
                  <button
                    className="btn btn-light border rounded-0"
                    onClick={() => {
                      setQuoteForm(true);
                      setQuoteProduct(a.name);
                    }}
                  >
                    Get Quote
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {quoteForm == true && (
        <form key={2} onSubmit={handleSubmit(getQuote)}>
          <input placeholder={quoteProduct} {...register("product")} />
          <input placeholder="Amount" {...register("amount")} />
          <input placeholder="Period" {...register("period")} />
          <select {...register("currency")}>
            <option value="bitcoin">Bitcoin</option>;
            <option value="VRC">VRC</option>;
            <option value="ethereum">Ethereum</option>;
            <option value="DAI">DAI</option>;<option value="USDT">USDT</option>
          </select>
          <input type="submit" className="btn btn-light rounded-0" />
        </form>
      )}
      <button className="btn btn-light border rounded-0" onClick={getQuoteTest}>
        Get Quote Test
      </button>
    </div>
  );
}
