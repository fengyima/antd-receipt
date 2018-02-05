import React, {Component} from "react";
import {Link} from "react-router-dom";
import {Button, WingBlank, WhiteSpace, Checkbox} from "antd-mobile";
import "../css/welcome.css";
import logo from "../logo.svg";
import Signature  from "./Signature";

export default class Agreement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: "primary"
        };
    }
    render() {
        let {type} = this.state;
        let {history} = this.props;

        return (
            <WingBlank>
                <Signature ref="mySignature" />
                <div className="logoRow">
                    <img className="logo" src={logo} />
                    <h3 className="title">写协议</h3>
                    <p className="desc">为你提供在线的电子协议</p>
                </div>
                <WhiteSpace />
                <Button
                    type={type}
                    onClick={() => {
                        history.push("/write");
                    }}
                >
                    开始写协议
                </Button>
                <WhiteSpace />
                <Checkbox
                    className="my-checkbox"
                    defaultChecked={true}
                    onChange={e => console.log("checkbox", e)}
                >
                    &nbsp;
                    <Link to="/agreement">同意《用户协议》</Link>
                </Checkbox>
            </WingBlank>
        );
    }
}
