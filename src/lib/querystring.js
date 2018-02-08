
import {isPlainObject}from "./tools";

function encode(name, value, encoder) {
    return encoder(name) + (value === null ? "" : "=" + encoder(value));
}

let qsFn = {
    /**
     * 把数据序列化为URL参数
     * @method stringify
     * @param {Object|Array<Object<name,value>>} data 数据
     * @param {Object} [o] 参数
     *   @param {Function} [o.encode=encodeURIComponent] 编码函数
     * @return {String} URL参数串
     */
    stringify: function(data, o) {
        if (typeof data === "string") {
            return data;
        }

        o = Object.assign(
            {},
            {
                encode: encodeURIComponent
            },
            o
        );

        let result = [];
        if (data instanceof Array) {
            data.forEach(function(d) {
                result.push(encode(d.name, d.value, o.encode));
            });
        } else {
            for (let name in data) {
                if ({}.hasOwnProperty.call(data, name)) {
                    result.push(encode(name, data[name], o.encode));
                }
            }
        }

        return result.join("&");
    },

    /**
     * 把URL参数反序列化为数据
     * @method parse
     * @param {String} [qs] URL参数，默认为当前窗口的location.search
     * @param {Object} [o] 参数
     *   @param {Function} [o.decode=decodeURIComponent] 解码函数
     *   @param {String} [o.dataType] 返回数组类型，默认为Object，参数值为'array'时返回数组
     * @return {Object|Array<Object<name,value>>} 数据
     */
    parse: function(qs, o) {
        o = Object.assign(
            {
                decode: decodeURIComponent
            },
            o
        );

        let returnArray = o.dataType === "array",
            data = returnArray ? [] : {};
        qs = (qs || window.location.search.substr(1))
            .replace(/(?:^|&)([^&]+)=([^&]*)/g, function($0, $1, $2) {
                let value = $2;
                try {
                    value = o.decode(value);
                } catch (e) {
                    console.log(e);
                }
                if (returnArray) {
                    data.push({
                        name: $1,
                        value: value
                    });
                } else {
                    data[$1] = value;
                }
                return "";
            })
            .split("&");

        for (let i = 0; i < qs.length; i++) {
            if (qs[i]) {
                if (returnArray) {
                    data.push({
                        name: qs[i],
                        value: null
                    });
                } else {
                    data[qs[i]] = null;
                }
            }
        }

        return data;
    },

    /**
     * 把数据序列化为URL参数后添加到指定URL
     * @method append
     * @param {String} url URL
     * @param {Object|String} data 数据
     * @param {Object} [o] 参数
     *   @param {Function(value)} [o.encode=encodeURIComponent] 编码函数
     * @return {String} 处理后的URL
     */
    append: function(url, data, o) {
        if (!data || !isPlainObject(data) || (Array.isArray(data) && !data.length)) {
            return url;
        }

        if (typeof data !== "string") {
            data = this.stringify(data, o);
        }
        data = data.replace(/^[?&]+/, "");

        let temp = url.indexOf("#"),
            hash = "";
        if (temp !== -1) {
            hash = url.substring(temp, url.length);
            url = url.substring(0, temp);
        }
        url = url.replace(/[?&]+$/, "");

        return url + (url.indexOf("?") === -1 ? "?" : "&") + data + hash;
    },
    /**
     * 移除url中的参数
     * @method remove
     * @param {String} url URL
     * @param {String} param 需要移除的参数
     * @return {String} 返回处理后url
     */
    remove: function(url, param) {
        let urlparts = url.split("?");
        if (urlparts.length >= 2) {
            let prefix = encodeURIComponent(param) + "=";
            let pars = urlparts[1].split(/[&;]/g);

            for (let i = pars.length; i-- > 0; ) {
                if (pars[i].lastIndexOf(prefix, 0) !== -1) {
                    pars.splice(i, 1);
                }
            }

            url = urlparts[0] + (pars.length > 0 ? "?" + pars.join("&") : "");
            return url;
        }

        return url;
    }
};

export default qsFn;
export const parse = qsFn.parse;
export const stringify = qsFn.stringify;
export const remove = qsFn.remove;
