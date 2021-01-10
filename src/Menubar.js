import React, { Component } from "react";
import { Route, NavLink, HashRouter, Switch, Redirect } from "react-router-dom";

import Workdesk from "./workdesk/Workdesk";
import Callhistory from "./Callhistory";
import { withAuth0 } from "@auth0/auth0-react";
import LogoutButton from "./Auth/LogoutButton";
import CallCompleted from "./CallCompleted";
import Logo from "./Logo/Logo";

class Menubar extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
    };
  } //end constructor

  addActiveforWorkdesk() {
    var element1 = document.getElementById("li_workdesk");
    element1.classList.add("active");

    var element2 = document.getElementById("li_callhistory");
    element2.classList.remove("active");
  }

  addActiveforCallHistory() {
    var element1 = document.getElementById("li_callhistory");
    element1.classList.add("active");

    var element2 = document.getElementById("li_workdesk");
    element2.classList.remove("active");
  }

  render() {
    const { user } = this.props.auth0;
    return (
      <HashRouter>
        <header class="topbar-nav">
          <nav class="navbar navbar-expand">
            <ul class="navbar-nav mr-auto align-items-center">
              <li class="nav-item">
                <a class="nav-link" href="javascript:void();">
                  <div class="media align-items-center">
                    <Logo />
                  </div>
                </a>
              </li>
              <li class="nav-item">
                <ul class="horizontal-menu" style={{ display: "flex" }}>
                  <li
                    onClick={() => this.addActiveforWorkdesk()}
                    id="li_workdesk"
                  >
                    <NavLink to="/workdesk">
                      <i
                        class="zmdi zmdi-view-dashboard"
                        aria-hidden="true"
                      ></i>
                      <span class="title">Work Desk</span>
                    </NavLink>
                  </li>

                  <li
                    onClick={() => this.addActiveforCallHistory()}
                    id="li_callhistory"
                  >
                    <NavLink to="/callhistory">
                      <i class="zmdi zmdi-layers"></i>
                      <span class="title">Call History</span>
                    </NavLink>
                  </li>
                </ul>
              </li>
            </ul>
            <ul class="navbar-nav align-items-center right-nav-link">
              <li class="nav-item">Welcome&nbsp;{user.name} </li>
            </ul>{" "}
            &nbsp;&nbsp;
            <LogoutButton /> &nbsp;&nbsp;
          </nav>
        </header>

        <RoutesPath />
      </HashRouter>
    );
  }
}

export default withAuth0(Menubar);

let RoutesPath = () => {
  return (
    <Switch>
      <Route exact path="/workdesk" component={Workdesk} />
      <Route path="/callhistory" component={Callhistory} />
      <Route path="/" component={Workdesk} />
      <Route path="/callStatus" component={CallCompleted} />
    </Switch>
  );
};
