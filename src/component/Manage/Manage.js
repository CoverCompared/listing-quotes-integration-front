import { useState, useEffect } from "react";
import { CompanyManagementContract } from "../../abi/abis";
import { useForm } from "react-hook-form";
import Web3 from "web3";
import "bootstrap/dist/css/bootstrap.min.css";

const web3 = new Web3(Web3.givenProvider);

//contract address
const contractAddr = "0xC6beB3Fed31849Bac7c80D2BF156206Ff25DB546";
const SimpleContract = new web3.eth.Contract(
  CompanyManagementContract,
  contractAddr
);

//TO DO : Add a form which keeps track of all the protocols available on Polka Cover

export function Manage() {
  const { register, handleSubmit } = useForm();
  const [account, setAccount] = useState();
  const [apiProductList, setApiProductList] = useState([]);

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
  };

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

  return (
    <div>
      <form key={1} onSubmit={handleSubmit(addCompany)}>
        <input placeholder="Company Name" {...register("companyName")} />
        <input placeholder="Logo Link" {...register("linkLogo")} />
        <input placeholder="Product List API" {...register("apiProduct")} />
        <input placeholder="Product Quote API" {...register("apiQuote")} />{" "}
        <select {...register("status")}>
          <option value="0">ACTIVE </option>
          <option value="1">JOINING VERY SOON</option>
        </select>
        <input type="submit" className="btn btn-light rounded-0" />
      </form>
      <button className="btn btn-dark rounded-0" onClick={listCompany}>
        List Company
      </button>
    </div>
  );
}
