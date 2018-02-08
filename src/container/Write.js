import React, {Component} from "react";
import {Link} from "react-router-dom";
import {List, InputItem, Picker, Checkbox, WhiteSpace, WingBlank, Button} from "antd-mobile";
import "../css/receipt.css";

import {RATE, PURPOST} from "../config/rate.config";
import {regObj} from "../config/reg.config";
import {dateFormat, isCanvasBlank} from "../lib/tools";
import Signature from "../lib/Signature";
import "whatwg-fetch";

const AgreeItem = Checkbox.AgreeItem;

const nowTimeStamp = Date.now();

function calcInterest(rate, count, cycle) {
    return parseFloat(rate, 10) * count * cycle / 365;
}

let signInstance;

export default class Write extends Component {
    constructor(props) {
        super(props);
        this.state = {
            borrowerName: "",
            borrowerNameErr: false,
            borrowerId: "",
            borrowerIdErr: false,
            borrowerSignature: "",
            lenders: "",
            lendersErr: false,
            borrowerAmount: 0,
            borrowerAmountErr: false,
            borrowerCycle: 0,
            borrowerCycleErr: false,
            borrowDate: nowTimeStamp,
            repaymentDate: nowTimeStamp,
            rateValue: RATE[0][0].value,
            interest: 0.0,
            purpostValue: PURPOST[0][0].value,
            isBtnDisable: true,
            AgreeItemChecked: true,
            layerShow: false,
            signatureStr: ""
        };
    }

    componentDidMount() {
        // this.postData();
    }

    postData() {
        let {
            borrowerName,
            borrowerId,
            signatureStr,
            lenders,
            borrowerAmount,
            borrowerCycle,
            rateValue,
            borrowDate,
            repaymentDate,
            purpostValue
        } = this.state;

        let body = {
            datas: {
                borrower: borrowerName,
                borrwoerId: borrowerId,
                autograph: signatureStr,
                lender: lenders,
                borrowMoney: borrowerAmount,
                borrowCycle: borrowerCycle,
                interestRate: parseInt(rateValue, 10),
                borrowDate: borrowDate,
                repaymentDate: repaymentDate,
                purpose: purpostValue,
                serviceCharge: 9.9,
                openId: "",
                iouNumber: ""
            }
        };

        fetch("http://www.xiexieyi.com/mz/receiveMessage/iouService/createIou.do", {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            body: JSON.stringify(body)
        })
            .then(res => {
                return res.json();
            })
            .then(json => {
                let datas = json.datas;
                sessionStorage.setItem("iouNumber", datas.iouNumber);
            });

        // history.push("/write");
    }

    onBorrowerAmount(borrowerAmount) {
        let {rateValue, borrowerCycle} = this.state;
        this.calcInterest(rateValue, borrowerAmount, borrowerCycle);
    }

    onBorrowerCycle(borrowerCycle) {
        let {rateValue, borrowerAmount} = this.state;
        this.calcInterest(rateValue, borrowerAmount, borrowerCycle);
    }

    onRateChange(rateValue) {
        let {borrowerAmount, borrowerCycle} = this.state;
        this.setState({
            rateValue
        });
        this.calcInterest(rateValue, borrowerAmount, borrowerCycle);
    }

    calcInterest(rateValue, borrowerAmount, borrowerCycle) {
        let interest = calcInterest(rateValue, borrowerAmount, borrowerCycle).toFixed(2);
        this.setState({
            interest
        });
    }

    checkInput(target, value, type) {
        let newState = {
            [target]: value,
            [target + "Err"]: !regObj[type].test(value)
        };
        this.setState(newState);
    }

    checkAllStatu() {
        setTimeout(() => {
            let {
                borrowerName,
                borrowerId,
                lenders,
                borrowerAmount,
                borrowerCycle,
                AgreeItemChecked,
                signatureStr
            } = this.state;

            let isBtnDisable = true;

            if (
                !!borrowerName &&
                !!borrowerId &&
                !!lenders &&
                !!borrowerAmount &&
                !!borrowerCycle &&
                AgreeItemChecked &&
                signatureStr !== ""
            ) {
                isBtnDisable = false;
            } else {
                isBtnDisable = true;
            }
            this.setState({
                isBtnDisable
            });
        }, 100);
    }

    showLayer(layerShow) {
        this.setState(
            {
                layerShow
            },
            () => {
                if (!signInstance) {
                    signInstance = new Signature(this.refs.canvas);
                    signInstance.init();
                }
            }
        );
    }

    getSignatureImg() {
        let img = signInstance.save();
        let isBlank = isCanvasBlank(this.refs.canvas);

        this.setState({
            signatureStr: isBlank ? "" : img
        });
        if (isBlank) {
            this.addSinatureErrTip(true);
        } else {
            this.addSinatureErrTip(false);
        }
    }

    clearSignature() {
        signInstance.clear();
    }

    addSinatureErrTip(bool) {
        //
        let container = this.refs.signatureContainer;
        if (bool) {
            container.classList.add("am-input-error");
        } else {
            container.classList.remove("am-input-error");
        }
    }

    render() {
        let {
            rateValue,
            purpostValue,
            interest,
            isBtnDisable,
            borrowerNameErr,
            borrowerIdErr,
            lendersErr,
            borrowerAmountErr,
            borrowerCycleErr,
            borrowDate,
            repaymentDate,
            layerShow,
            signatureStr
        } = this.state;
        let {history} = this.props;
        return (
            <section className="receipt">
                <List>
                    <InputItem
                        type="text"
                        placeholder="请输入借款人姓名"
                        clear={true}
                        maxLength="8"
                        error={borrowerNameErr}
                        onBlur={v => {
                            this.checkAllStatu();
                            this.checkInput("borrowerName", v, "name");
                        }}
                    >
                        借款人
                    </InputItem>
                    <div className="errTip">请输入2-8位的中文名字！</div>
                    <InputItem
                        type="text"
                        placeholder="请输入身份证号"
                        clear={true}
                        maxLength="18"
                        error={borrowerIdErr}
                        onBlur={v => {
                            this.checkAllStatu();
                            this.checkInput("borrowerId", v, "id");
                        }}
                    >
                        身份证号
                    </InputItem>
                    <div className="errTip">请输入正确的18位身份证号码！</div>
                    <div
                        className="am-list-item am-input-item am-list-item-middle am-list-item-middle-disable"
                        ref={"signatureContainer"}
                    >
                        <div className="am-list-line">
                            <div className="am-input-label am-input-label-5">电子签名</div>
                            <div className="signatureTip" onClick={this.showLayer.bind(this, true)}>
                                {signatureStr === "" ? (
                                    <span>点击签署</span>
                                ) : (
                                    <img src={signatureStr} alt="signature" />
                                )}
                            </div>
                            <div className="am-input-error-extra" />
                        </div>
                    </div>
                    <div className="errTip">请签名！</div>
                </List>
                <List>
                    <InputItem
                        type={"text"}
                        placeholder="请输入出借人姓名"
                        clear={true}
                        maxLength="6"
                        error={lendersErr}
                        onBlur={v => {
                            this.checkInput("lenders", v, "name");
                            this.checkAllStatu();
                        }}
                    >
                        出借人
                    </InputItem>
                    <div className="errTip">请输入2-8位的中文名字！</div>
                </List>
                <List>
                    <InputItem
                        type="money"
                        placeholder="请输入金额数目，范围0.1~500000"
                        clear
                        maxLength="7"
                        onBlur={v => {
                            this.onBorrowerAmount(v);
                            this.checkInput("borrowerAmount", v, "money");
                            this.checkAllStatu();
                        }}
                        error={borrowerAmountErr}
                    >
                        借款金额
                    </InputItem>
                    <div className="errTip">请输入金额数目，范围0.1~500000！</div>
                    <InputItem
                        type="digital"
                        placeholder="请输入天数，范围1~356"
                        clear={true}
                        maxLength="3"
                        error={borrowerCycleErr}
                        onBlur={v => {
                            this.onBorrowerCycle(v);
                            this.checkInput("borrowerCycle", v, "cycle");
                            this.checkAllStatu();
                            this.setState({
                                repaymentDate: borrowDate + (v - 1) * 3600 * 24 * 1000
                            });
                        }}
                    >
                        借款周期
                    </InputItem>
                    <div className="errTip">请输入天数，范围1~356！</div>
                    <Picker
                        data={RATE}
                        title="选择利率"
                        cascade={false}
                        value={[rateValue]}
                        cols={1}
                        onChange={v => {
                            this.onRateChange(v[0]);
                        }}
                        onOk={v => {
                            this.setState({
                                rateValue: v[0]
                            });
                        }}
                    >
                        <List.Item arrow="horizontal">利率</List.Item>
                    </Picker>
                    <div className="caleRate">利息：{interest}元</div>
                    <InputItem
                        type="text"
                        placeholder="借款日期"
                        disabled={true}
                        value={dateFormat(borrowDate, "YYYY年MM月dd日")}
                    >
                        借款日期
                    </InputItem>
                    <InputItem
                        type="text"
                        placeholder="还款日期"
                        disabled={true}
                        value={dateFormat(repaymentDate, "YYYY年MM月dd日")}
                    >
                        还款日期
                    </InputItem>
                    <Picker
                        data={PURPOST}
                        title="选择用途"
                        cascade={false}
                        cols={1}
                        value={[purpostValue]}
                        onChange={v =>
                            this.setState({
                                purpostValue: v[0]
                            })
                        }
                        onOk={v =>
                            this.setState({
                                purpostValue: v[0]
                            })
                        }
                    >
                        <List.Item arrow="horizontal">用途</List.Item>
                    </Picker>
                    <div
                        className="am-list-item am-input-item am-list-item-middle am-list-item-middle-disable"
                        ref={"signatureContainer"}
                    >
                        <div className="am-list-line">
                            <div className="am-input-label am-input-label-5">服务费用</div>
                            <div className="signatureTip highlight">￥9.9</div>
                        </div>
                    </div>
                </List>
                <List className="checkbox">
                    <AgreeItem
                        defaultChecked={true}
                        onChange={e => {
                            this.setState({
                                AgreeItemChecked: e.target.checked
                            });
                        }}
                    >
                        &nbsp;同意
                        <Link to="/serviceAgr">《居间服务协议》</Link>
                        <Link to="/borrowAgr">《借款协议》</Link>
                    </AgreeItem>
                </List>
                <WingBlank>
                    <WhiteSpace />
                    <Button
                        type={"primary"}
                        onClick={() => {
                            this.postData();
                        }}
                        disabled={isBtnDisable}
                    >
                        确认无误，创建协议
                    </Button>
                    <WhiteSpace />
                </WingBlank>
                <div className={layerShow ? "layer" : "layer hide"}>
                    <div className="signature">
                        <canvas className="canvas" ref="canvas" />
                        <WingBlank>
                            <WhiteSpace />
                            <Button
                                inline
                                style={{marginRight: "15px"}}
                                onClick={() => {
                                    this.showLayer(false);
                                    this.addSinatureErrTip(true);
                                }}
                            >
                                取消
                            </Button>
                            <Button
                                type={"warning"}
                                inline
                                style={{marginRight: "15px"}}
                                onClick={this.clearSignature}
                            >
                                擦除
                            </Button>
                            <Button
                                type={"primary"}
                                inline
                                onClick={() => {
                                    this.showLayer(false);
                                    this.getSignatureImg();
                                    this.checkAllStatu();
                                }}
                            >
                                确定
                            </Button>
                            <WhiteSpace />
                        </WingBlank>
                    </div>
                </div>
            </section>
        );
    }
}
