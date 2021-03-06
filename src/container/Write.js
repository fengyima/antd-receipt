import React, {Component} from "react";
import {Link} from "react-router-dom";
import {List, InputItem, Picker, Checkbox, WhiteSpace, WingBlank, Button, Toast} from "antd-mobile";
import "../css/receipt.css";

import {RATE, PURPOST} from "../config/rate.config";
import {regObj} from "../config/reg.config";
import {dateFormat, isCanvasBlank, calcInterest, type, fillTimestamp} from "../lib/tools";
import qs from "../lib/querystring";
import Signature from "../lib/Signature";
import "whatwg-fetch";
import "vConsole";
let PAGE_INFO = qs.parse();
let cost = PAGE_INFO.count || 9.9;

const AgreeItem = Checkbox.AgreeItem;

const nowTimeStamp = Date.now();

let signInstance = null;

window.Toast = Toast;

// let WeixinJSBridge = window.WeixinJSBridge;
// console.log(WeixinJSBridge)

const appId = "wxee20b8e3fb529804";

export default class Write extends Component {
    constructor(props) {
        super(props);
        let borrowerCycle = sessionStorage.getItem("borrowerCycle");
        let repaymentDate = nowTimeStamp + ((borrowerCycle || 1) - 1) * 3600 * 24 * 1000;
        let rateValue = sessionStorage.getItem("rateValue") || RATE[0][0].value;
        let borrowerAmount = sessionStorage.getItem("borrowerAmount") || 0;
        this.state = {
            // borrowerName: "",
            borrowerNameErr: false,
            // borrowerId: "",
            borrowerIdErr: false,
            // lenders: "",
            lendersErr: false,
            // borrowerAmount: 0,
            borrowerAmountErr: false,
            // borrowerCycle: 0,
            borrowerCycleErr: false,
            borrowDate: nowTimeStamp,
            repaymentDate,
            // rateValue: RATE[0][0].value,
            // interest: 0.0,
            // purpostValue: PURPOST[0][0].value,
            isBtnDisable: true,
            AgreeItemChecked: true,
            layerShow: false,
            // signatureStr: "",

            borrowerName: sessionStorage.getItem("borrowerName"),
            borrowerId: sessionStorage.getItem("borrowerId"),
            lenders: sessionStorage.getItem("lenders"),
            borrowerAmount,
            borrowerCycle,
            rateValue,
            interest: calcInterest(rateValue, borrowerAmount, borrowerCycle).toFixed(2),
            purpostValue: sessionStorage.getItem("purpostValue") || PURPOST[0][0].value,
            signatureStr: sessionStorage.getItem("signatureStr") || ""
        };
    }

    componentDidMount() {
        // this.postData();
        this.checkAllStatu();
        PAGE_INFO.openId = PAGE_INFO.openId || sessionStorage.getItem("openId");

        if (signInstance instanceof Signature) {
            signInstance = new Signature(this.refs.canvas);
            signInstance.init();
            signInstance.defaultImg(this.state.signatureStr);
        }
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
                borrowDate: dateFormat(borrowDate, "YYYY-MM-dd"),
                repaymentDate: dateFormat(repaymentDate, "YYYY-MM-dd"),
                purpose: purpostValue,
                serviceCharge: 9.9,
                openId: PAGE_INFO.openId,
                iouNumber: sessionStorage.getItem("iouNumber") || ""
            }
        };

        Toast.loading("加载中");

        // let datas = {
        //     timestamp: "1518331789",
        //     nonceStr: "42f9a641c5bc46798de70fa5f16cda60",
        //     package: "prepay_id=wx201802111449494b06e975140378704676",
        //     signType: "MD5",
        //     paySign: "21EEEE411BBE90A8CF36DE5D6AFB0AAE",
        //     iouNumber: "2018021114494900"
        // };
        // sessionStorage.setItem("iouNumber", datas.iouNumber);
        // this.getWCpay(datas, this.onPayCallBack);
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
                Toast.hide();
                if (json.status) {
                    let datas = json.datas;
                    if (type(datas) === "string") {
                        datas = JSON.parse(datas);
                    }
                    this.payDatas = datas;
                    sessionStorage.setItem("iouNumber", datas.iouNumber);
                    this.getWCpay(datas, this.onPayCallBack.bind(this));
                }
            });
    }

    onPayCallBack(errMsg) {
        let {history} = this.props;
        let iouNumber = sessionStorage.getItem("iouNumber");
        if (errMsg === "get_brand_wcpay_request:ok") {
            Toast.success("生成协议成功");
            setTimeout(() => {
                history.push(`/agreement?iouNumber=${iouNumber}`);
            }, 1000);
        } else {
            Toast.success("支付成功");
        }
    }

    onBridgeReady(data = this.payDatas, callback) {
        // return function() {
            // console.log(data);
            window.WeixinJSBridge.invoke(
                "getBrandWCPayRequest",
                {
                    ...data
                },
                function(res) {
                    // console.log(res);
                    callback(res.err_msg);
                }
            );
        // };
    }

    getWCpay(data, callback) {

        let wxData = {
            appId, //公众号名称，由商户传入
            timeStamp: fillTimestamp(data.timestamp, 10) + "",
            nonceStr: data.nonceStr, //随机串
            package: data.package,
            signType: data.signType, //微信签名方式：
            paySign: data.paySign //微信签名
        };
        this.onBridgeReady(wxData,callback);
        // window.onBridgeReady(wxData);
        if (typeof (WeixinJSBridge) === "undefined") {
            if (document.addEventListener) {
                document.addEventListener("WeixinJSBridgeReady", this.onBridgeReady(data), false);
            } else if (document.attachEvent) {
                document.attachEvent("WeixinJSBridgeReady", this.onBridgeReady(data));
                document.attachEvent("onWeixinJSBridgeReady", this.onBridgeReady(data));
            }
        } else {
        }
    }

    callWeCahtConfig(data, success) {
        window.wx.config({
            debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId,
            openId: PAGE_INFO.openId, // 必填，公众号的唯一标识
            timestamp: data.timestamp, // 必填，生成签名的时间戳
            nonceStr: data.nonceStr, // 必填，生成签名的随机串
            signature: data.signature, // 必填，签名
            jsApiList: ["chooseWXPay"] // 必填，需要使用的JS接口列表
        });

        this.callWeChatPay(data, success);
    }

    callWeChatPay(data, success) {
        window.wx.chooseWXPay({
            ...data,
            success
        });
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
        let isErr = !regObj[type].test(value);
        let newState = {
            [target]: value,
            [target + "Err"]: isErr
        };

        this.setState(newState);
        if (!isErr) {
            sessionStorage.setItem(target, value);
        } else {
            sessionStorage.removeItem(target, value);
        }
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
        }, 10);
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
                signInstance.refleshStageInfo();
                signInstance.defaultImg(this.state.signatureStr);
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
            sessionStorage.setItem("signatureStr", img);
        }
    }

    clearSignature() {
        signInstance.clear();
        sessionStorage.removeItem("signatureStr");
    }

    addSinatureErrTip(bool) {
        //
        let container = this.refs.signatureContainer;
        let isBlank = isCanvasBlank(this.refs.canvas);
        if (isBlank) {
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
            signatureStr,
            borrowerName,
            borrowerId,
            lenders,
            borrowerAmount,
            borrowerCycle
        } = this.state;

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
                        defaultValue={borrowerName}
                    >
                        借款人
                    </InputItem>
                    <div className="errTip">请输入290-8位的中文名字！</div>
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
                        defaultValue={borrowerId}
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
                        defaultValue={lenders}
                    >
                        出借人
                    </InputItem>
                    <div className="errTip">请输入290-8位的中文名字！</div>
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
                        defaultValue={borrowerAmount}
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
                        defaultValue={borrowerCycle}
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
                            let value = v[0];
                            this.setState({
                                rateValue: value
                            });
                            this.onRateChange(value);
                            sessionStorage.setItem("rateValue", value);
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
                        onChange={v => {
                            this.setState({
                                purpostValue: v[0]
                            });
                        }}
                        onOk={v => {
                            let value = v[0];
                            sessionStorage.setItem("purpostValue", value);
                            this.setState({
                                purpostValue: value
                            });
                        }}
                    >
                        <List.Item arrow="horizontal">用途</List.Item>
                    </Picker>
                    <div className="am-list-item am-input-item am-list-item-middle am-list-item-middle-disable">
                        <div className="am-list-line">
                            <div className="am-input-label am-input-label-5">服务费用</div>
                            <div className="signatureTip highlight">￥{cost}</div>
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
