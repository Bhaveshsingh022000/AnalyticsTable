import React from "react";
import AnalyticsTable from "./Components/AnalyticsTable/AnalyticsTable";
import "./App.scss";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path={"/"}>
          <Redirect to={"/table"} />
        </Route>
        <Route path={"/table"}>
          <div style={{ width: "100vw" }}>
            <AnalyticsTable />
          </div>
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

export default App;
