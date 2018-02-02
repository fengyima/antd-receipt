import React, {Component} from "react";
import {BrowserRouter, Link, Route} from "react-router-dom";
import "./App.css";
import "antd-mobile/dist/antd-mobile.css";

import Write from "./container/Write";
import WelCome from "./container/WelCome";

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
                    <Route path="/write" component={Write} />
                </div>
            </BrowserRouter>
        );
    }
}

export default App;
