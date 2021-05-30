import "./App.css";
import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Manage } from "./component/Manage/Manage";
import { NewList } from "./component/List/NewList";
import { Test } from "./component/test";

const App = () => {
  return (
    <>
      <Router>
        <Switch>
          <Route path="/manage" component={Manage}></Route>
          {/* <Route path="/test" component={Test}></Route> */}
          <Route path="/list" component={NewList}></Route>
        </Switch>
      </Router>
    </>
  );
};
export default App;
