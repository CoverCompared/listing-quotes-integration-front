import { useState, useEffect } from "react";
import { CompanyManagementContract } from "../../abi/abis";
import { useForm } from "react-hook-form";
import Web3 from "web3";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

const web3 = new Web3(Web3.givenProvider);

//contract address
const contractAddr = "0xC6beB3Fed31849Bac7c80D2BF156206Ff25DB546";
const SimpleContract = new web3.eth.Contract(
  CompanyManagementContract,
  contractAddr
);

export function NewList() {
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
  const { handleSubmit, register } = useForm();
  const [account, setAccount] = useState();
  const [company, setCompany] = useState();
  const [productList, setProductList] = useState([]);
  const [matchingProducts, setMatchingProducts] = useState([]);
  const [displayProducts, setDisplayProducts] = useState(false);
  const [displayQuoteForm, setDisplayQuoteForm] = useState(false);
  const [quoteAPILink, setQuoteAPILink] = useState("");
  const [quoteProduct, setQuoteProduct] = useState("");
  const [quoteCost, setQuoteCost] = useState();
  const [showQuoteCost, setShowQuoteCost] = useState(false);

  //Getting all the company's product information
  useEffect(async () => {
    //Setting address
    const address = await window.ethereum.enable();
    setAccount(address[0]);

    //Getting company list length
    const companyListLength = await SimpleContract.methods
      .getIdxLength()
      .call({ from: account });

    //Get all company details, APIs and store it in JSON
    for (var i = 0; i < companyListLength; i++) {
      const companyDetails = await SimpleContract.methods
        .getCompany(i)
        .call({ from: account });

      setCompany(companyDetails);

      //Call company API to get Product List
      const products = await axios.get(companyDetails[3]);

      //Store Product List
      productList[i] = {
        name: companyDetails[1],
        products: products.data.result.list,
        numberOfProducts: products.data.result.count,
        quoteAPI: companyDetails[4],
      };
      setProductList(productList);
    }
  }, []);

  const getChosenProducts = async (data) => {
    //Go to product list and find all products which match the description
    const wantedProduct = productList.map((details, i) =>
      details.products
        .filter((product, i) => product.name == data.name)
        .map((a, i) => {
          a.provider = details.name;
          a.quoteAPI = details.quoteAPI;
          return a;
        })
    );

    setMatchingProducts(wantedProduct);

    setDisplayProducts(true);

    setDisplayQuoteForm(false);
    showQuoteCost(false);
  };

  const showQuoteForm = (link, productName) => {
    setQuoteAPILink(link);
    setDisplayQuoteForm(true);
    setQuoteProduct(productName);
  };

  const getQuote = async (data) => {
    const productIdx = searchBarArray.indexOf(quoteProduct) + 1;
    data.product = productIdx;
    data.amount = `${+data.amount * 10 ** 18}`;
    const quoteDetails = await axios.post(quoteAPILink, data);
    console.log(quoteDetails);

    setQuoteCost(quoteDetails.data.result.list);
    setShowQuoteCost(true);
  };

  return (
    <div>
      <form key={1} onSubmit={handleSubmit(getChosenProducts)}>
        <select {...register("name")}>
          {searchBarArray.map((field, idx) => {
            return <option value={field}>{field}</option>;
          })}
        </select>
        <input type="submit" className="btn btn-light rounded-0" />
      </form>
      {displayProducts && (
        <div>
          <div className="card-group">
            {matchingProducts.map((matchingProduct, i) => {
              return (
                <div key={i} className="flex" id="cardIndividual">
                  <div className="card-body bg-light">
                    {matchingProduct.map((a, i) => {
                      return (
                        <>
                          <h5 className="card-title">{a.name}</h5>
                          <p className="card-text">
                            Securtiy Rating : {a.securityRating} <br />
                            Rate : {a.rate}
                          </p>
                          <button
                            className="btn btn-light border rounded-0"
                            onClick={() => showQuoteForm(a.quoteAPI, a.name)}
                          >
                            Get Quote
                          </button>
                        </>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {displayQuoteForm && (
        <form key={2} onSubmit={handleSubmit(getQuote)}>
          <input placeholder="Amount" {...register("amount")} />
          <input placeholder="Period" {...register("period")} />
          <select {...register("currency")}>
            <option value="0">Ethereum</option>;
            <option value="bitcoin">Bitcoin</option>;
            <option value="VRC">VRC</option>;<option value="DAI">DAI</option>;
            <option value="USDT">USDT</option>
          </select>
          <input type="submit" className="btn btn-light rounded-0" />
        </form>
      )}
      {showQuoteCost == true && <div>{quoteCost} Eth</div>}
    </div>
  );
}
