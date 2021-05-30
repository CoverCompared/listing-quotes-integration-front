import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

export const Test = () => {
  const { register, handleSubmit } = useForm();

  const getQuote = async (data) => {
    // const data = {
    //   product: "1",
    //   amount: "1000000000000000000",
    //   period: "30",
    //   currency: "0",
    // };
    const quote = await axios.post(
      "https://api.nsure.network/v1/get_quote",
      data
    );
    console.log(quote);

    // const data = {
    //   product: "1",
    //   amount: "1000000000000000000",
    //   period: "30",
    //   currency: "0",
    // };
    // console.log(data);
    // const quote = await axios.post(
    //   "https://api.nsure.network/v1/get_quote",
    //   data
    // );
    // console.log(quote);
  };
  return (
    <div>
      Test
      <form onSubmit={handleSubmit(getQuote)}>
        <input {...register("product")} />
        <input {...register("amount")} />
        <input {...register("period")} />
        <input {...register("currency")} />
        <input type="submit" />
      </form>
      {/* <button onClick={getQuote}>Get Sample Quote</button> */}
    </div>
  );
};

//"{"name":"yahao","product":"5","amount":"2000000000000000000","period":"30","currency":"0"}"
//"{"product":"0","amount":"1000000000000000000","period":"30","currency":"0"}"
