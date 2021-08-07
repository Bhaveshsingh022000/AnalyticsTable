import React from "react";
import AnalyticsTable from "./Components/AnalyticsTable/AnalyticsTable";
import "./App.scss";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path={"/table"}>
          <div style={{ width: "100vw" }}>
            <AnalyticsTable />
          </div>
        </Route>
        <Route exact path={"/"}>
          <Redirect to={"/table"} />
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

export default App;
