import React, {Component} from "react";
import {List, InputItem, Picker, DatePicker} from "antd-mobile";
import "../css/receipt.css";

function formatDate(date) {
    /* eslint no-confusing-arrow: 0 */
    const pad = n => (n < 10 ? `0${n}` : n);
    const dateStr = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
    const timeStr = `${pad(date.getHours())}:${pad(date.getMinutes())}`;
    return `${dateStr} ${timeStr}`;
}
const nowTimeStamp = Date.now();

const now = new Date();
let minDate = new Date(nowTimeStamp);
const maxDate = new Date(nowTimeStamp + 3600 * 24 * 90 * 1000);

const RATE = (function() {
    let target = 20;
    let base = 1;
    let result = [];
    for (let i = 1; i <= target; i++) {
        result.push({
            value: base * i / 10 + "%",
            label: base * i / 10 + "%"
        });
    }
    return [result];
})();

const PURPOST = [
    [
        {
            value: "日常消费",
            label: "日常消费"
        },
        {
            value: "教育",
            label: "教育"
        },
        {
            value: "医疗",
            label: "医疗"
        },
        {
            value: "装修",
            label: "装修"
        },
        {
            value: "旅游",
            label: "旅游"
        }
    ]
];

// const nowDate = new Date();
// const TODAY = nowDate.getFullYear() + "-" + (nowDate.getMonth() + 1) + "-" + nowDate.getDate();
// console.log(TODAY)

export default class Write extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: "text",
            rateExtra: RATE[0][0].value
        };
    }
    render() {
        let {type} = this.state;
        return (
            <section className="receipt">
                <List>
                    <InputItem type="text" placeholder="请输入借款人姓名" clear maxLength="6">
                        借款人
                    </InputItem>
                    <InputItem type="text" placeholder="请输入身份证号" clear maxLength="18">
                        身份证号
                    </InputItem>
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
                </List>
                <List>
                    <InputItem type={type} placeholder="请输入出借人姓名" clear maxLength="6">
                        出借人
                    </InputItem>
                </List>
                <List>
                    <InputItem
                        type="money"
                        placeholder="请输入金额数目，范围0.1~500000"
                        clear
                        maxLength="7"
                    >
                        借款金额
                    </InputItem>
                    <InputItem type="money" placeholder="请输入天数，范围1~356" clear maxLength="7">
                        借款周期
                    </InputItem>
                    <Picker
                        data={RATE}
                        title="选择利率"
                        cascade={false}
                        cols={1}
                        extra={RATE[0][0].value}
                        onChange={v =>
                            this.setState({
                                rateExtra: v[0]
                            })
                        }
                        onOk={v =>
                            this.setState({
                                rateExtra: v[0]
                            })
                        }
                    >
                        <List.Item arrow="horizontal">利率</List.Item>
                    </Picker>
                    <div className="caleRate">利息：2.14元</div>
                    <DatePicker
                        mode="date"
                        title="选择借款日期"
                        extra="Optional"
                        value={now}
                        minDate={minDate}
                        maxDate={maxDate}
                        onChange={date => this.setState({date})}
                    >
                        <List.Item arrow="horizontal">借款日期</List.Item>
                    </DatePicker>
                    <DatePicker
                        mode="date"
                        title="选择还款日期"
                        extra="Optional"
                        value={now}
                        minDate={minDate}
                        maxDate={maxDate}
                        onChange={date => this.setState({date})}
                    >
                        <List.Item arrow="horizontal">还款日期</List.Item>
                    </DatePicker>
                    <Picker
                        data={PURPOST}
                        title="选择用途"
                        cascade={false}
                        extra="选择用途"
                        value={this.state.sValue}
                        onChange={v => console.log(v)}
                        onOk={v => console.log(v)}
                    >
                        <List.Item arrow="horizontal">用途</List.Item>
                    </Picker>
                </List>
            </section>
        );
    }
}
