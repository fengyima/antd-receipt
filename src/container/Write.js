import React, {Component} from "react";
import {Link} from "react-router-dom";
import {
    List,
    InputItem,
    Picker,
    DatePicker,
    Checkbox,
    WhiteSpace,
    WingBlank,
    Button
} from "antd-mobile";
import "../css/receipt.css";

import {RATE, PURPOST} from "../config/rate.config";
import {regObj} from "../config/reg.config";
import {dateFormat} from "../lib/tools";

const AgreeItem = Checkbox.AgreeItem;

const nowTimeStamp = Date.now();

function calcInterest(rate, count, cycle) {
    return parseFloat(rate, 10) * count * cycle / 365;
}

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
            AgreeItemChecked: true
        };
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
                borrowerNameErr,
                borrowerIdErr,
                lendersErr,
                borrowerAmountErr,
                borrowerCycleErr,
                AgreeItemChecked
            } = this.state;

            let isBtnDisable = true;
            console.log(
                !borrowerNameErr,
                !borrowerIdErr,
                !lendersErr,
                !borrowerAmountErr,
                !borrowerCycleErr,
                AgreeItemChecked
            );

            if (
                !borrowerNameErr &&
                !borrowerIdErr &&
                !lendersErr &&
                !borrowerAmountErr &&
                !borrowerCycleErr &&
                AgreeItemChecked
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
            repaymentDate
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
                    <div className="errTip">请输入正确的18位省份证号码！</div>
                    <div className="am-list-item am-input-item am-list-item-middle">
                        <div className="am-list-line">
                            <div className="am-input-label am-input-label-5">电子签名</div>
                            <div className="am-input-control">
                                <input
                                    type="text"
                                    placeholder="点击签署"
                                    maxLength="18"
                                    value=""
                                    disabled
                                />
                            </div>
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
                        <Link to="/agreement">《居间服务协议》</Link>
                        <Link to="/agreement">《借款协议》</Link>
                    </AgreeItem>
                </List>
                <WingBlank>
                    <WhiteSpace />
                    <Button
                        type={"primary"}
                        onClick={() => {
                            history.push("/write");
                        }}
                        disabled={isBtnDisable}
                    >
                        确认无误，创建协议
                    </Button>
                    <WhiteSpace />
                </WingBlank>
            </section>
        );
    }
}
