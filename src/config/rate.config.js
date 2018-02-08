export const RATE = (function() {
    let target = 24;
    let base = 1;
    let result = [];
    for (let i = 1; i <= target; i++) {
        result.push({
            value: base * i + "%",
            label: base * i + "%"
        });
    }
    return [result];
})();

export const PURPOST = [
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
