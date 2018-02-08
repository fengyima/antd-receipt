import React, {Component} from "react";
import {Link} from "react-router-dom";
import {Button, WingBlank, WhiteSpace, Checkbox} from "antd-mobile";
import "../css/welcome.css";
import logo from "../images/icon.jpg";

export default class WelCome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            btnDisable: false
        };
    }
    render() {
        let {btnDisable} = this.state;
        let {history} = this.props;

        return (
            <WingBlank>
                <div className="logoRow">
                    <img className="logo" src={logo} alt="写协议" />
                    <h3 className="title">写协议</h3>
                    <p className="desc">为你提供在线的电子协议</p>
                </div>
                <WhiteSpace />
                <Button
                    type={"primary"}
                    onClick={() => {
                        history.push("/write");
                    }}
                    disabled={btnDisable}
                >
                    开始写协议
                </Button>
                <WhiteSpace />
                <Checkbox
                    className="my-checkbox"
                    defaultChecked={true}
                    onChange={e => {
                        this.setState({
                            btnDisable: !e.target.checked
                        });
                    }}
                >
                    &nbsp;同意
                    <Link to="/userAgr">《用户协议》</Link>
                </Checkbox>
            </WingBlank>
        );
    }
}
