import React, {Component} from "react";
import "../css/agr.css";
export default class Agreement extends Component {
    render() {
        return (
            <section className="agreement">
                <div className="header">
                    <div className="status">
                        <span>状态：</span>
                        <span className="img" />
                    </div>
                    <span className="protolNum">协议编号：XXXXXXXXX</span>
                </div>
                <div className="content">
                    <h2 className="title">借款协议</h2>
                    <p className="detail">
                        <span className="highlight">李四</span>（身份证号码：<span className="space" />{" "}
                        ）借款给<span className="highlight">李四</span>（身份证号码：<span className="highlight">李四</span>），借款金额：<span className="highlight">
                            李四
                        </span>元（人民币），借款周期：<span className="highlight">李四</span>天，借款日期：<span className="highlight">
                            李四
                        </span>，还款日期：<span className="highlight">李四</span>，年利率：<span className="highlight">
                            李四
                        </span>
                        ，本息总计：<span className="highlight">李四</span>元（人民币）。
                    </p>
                    <p className="detail">
                        出借人<span className="highlight">李四</span>
                    </p>
                    <p className="detail">
                        <span>出借人：</span>
                        <span className="img" />
                    </p>
                </div>
                <div className="tip">
                    <p className="detail">
                        提示：<br />1、请点击右上角 ... 把借款协议链接分享（转发）给出借人进行确认。<br />2、待确认的借款协议不具备法律效应，请及时分享（转发）给出借人确认。
                    </p>
                </div>
            </section>
        );
    }
}
