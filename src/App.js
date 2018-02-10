import React, {Component} from "react";
import {BrowserRouter, Route} from "react-router-dom";

import "antd-mobile/dist/antd-mobile.css";
import "./App.css";
import Write from "./container/Write";
import WelCome from "./container/WelCome";
import Agreement from "./container/Agreement";
import UserAgr from "./container/UserAgr";
import ServiceAgr from "./container/ServiceAgr";
import BorrowAgr from "./container/BorrowAgr";
document.domain = "xiexieyi.com";
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false
        };
    }
    render() {
        return (
            <BrowserRouter>
                <div className="App">
                    <Route exact path="/" component={WelCome} />
                    <Route path="/index.html" component={WelCome} />
                    <Route path="/write" component={Write} />
                    <Route path="/agreement" component={Agreement} />
                    <Route path="/userAgr" component={UserAgr} />
                    <Route path="/serviceAgr" component={ServiceAgr} />
                    <Route path="/borrowAgr" component={BorrowAgr} />
                </div>
            </BrowserRouter>
        );
    }
}

export default App;
