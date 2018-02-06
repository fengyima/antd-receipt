import React, {Component} from "react";
import "../css/agr.css";
export default class BorrowAgr extends Component {
    render() {
        return (
            <section className="agreement">
                <h1 className="title">借款协议（模板）</h1>
                <p className="text text-right">协议编号：XXXXXXXXX</p>
                <div className="detail">
                    <p className="text">
                        甲方（出借人）：<span className="red">出借人姓名</span>
                        <br />甲方身份证号码：<span className="red">xxxxxxxxxxxxxxxxxx</span>
                        <br />
                        <br />乙方（出借人）：<span className="red">借款人姓名 </span>
                        <br />乙方身份证号码：<span className="red">xxxxxxxxxxxxxxxxxx</span>
                        <br />
                        <br />甲乙双方因借款事宜，经协商达成如下协议：
                    </p>
                </div>
                <div className="detail">
                    <h2 className="hd">一、借款内容</h2>
                    <p className="text">
                        借款金额：<span className="red">xxxx元（XXXX元整）</span>
                        <br />
                        <br />借款日期：<span className="red">xxxx年xx月x日</span>
                        <br />
                        <br />还款日期：<span className="red">xxxx年xx月x日</span>
                        <br />
                        <br />年化利率：<span className="red">x%</span>
                        <br />
                        <br />借款用途：<span className="red">xxxx</span>
                        <br />
                        <br />本息总计：<span className="red">xxxx元（xxxx元整）</span>
                    </p>
                </div>
                <div className="detail">
                    <h2 className="hd">二、协议流程</h2>
                    <p className="text">
                        1、甲乙双方在线下完成了借款资金的划转交割后，如果认为有需要通过【写协议】平台完成手续的，乙方可在【写协议】平台起草协议，起草完成后发给甲方，即代表承认协议中约定的借款金额等内容。
                        <br />2、甲方收到协议后，如果发现信息有误，可以要求乙方重写；如果确认无误，点击确认按钮即可认可协议中约定内容，到此协议手续办理完毕。
                        <br />3、甲乙双方可根据需要决定是否进行本流程，居间服务商在此仅提供协议模板，其他约定由甲乙双方另外自行约定。
                    </p>
                </div>
                <div className="detail">
                    <h2 className="hd">三、资金交接方式</h2>
                    <p className="text">
                        1、甲乙双方的资金交接方式，由甲乙双方自行约定。
                        <br />2、最终的实际履行，以甲乙双方转账记录为准。
                    </p>
                </div>
                <div className="detail">
                    <h2 className="hd">四、违约金</h2>
                    <p className="text">
                        从还款日的次日计算违约金，以截止至当日未偿还借款本机利息之和为基数，每日按年化利率24%计收罚息
                    </p>
                </div>
                <div className="detail">
                    <h2 className="hd">五、其他</h2>
                    <p className="text">
                        1、本协议经甲、乙通过【写协议】平台以网络在线点击确认的方式签订，各方点击确认后本协议生效。
                        <br />2、各方均确认，本协议的签订、生效和履行以不违反法律为前提。如果本协议中的任何一条或多条违反适用法律，则该条视为无效，但该无效条款并不影响本协议其他条款的效力。
                        <br />3、甲乙双方熟知并且授权，【写协议】平台在提供服务期间，向CA机构申请CA数字证书并对本协议进行签署。
                        <br />4、本协议中所用的定义，除非另有规定，否则应适用【写协议】平台规则，【写协议】平台对本文定义享有最终解析权。
                    </p>
                </div>
                <div className="detail">
                    <p className="text">
                        <br />甲方（出借人）：<span className="red">出借人电子签名</span>
                        <br />
                        <br />乙方（借款人）：<span className="red">借款人电子签名 </span>
                    </p>
                </div>
            </section>
        );
    }
}
