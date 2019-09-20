"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_1 = require("./node");
var KeyStream = /** @class */ (function () {
    function KeyStream(key, start) {
        this.s = key;
        this.cur = start || 0;
        this.len = key.length;
    }
    KeyStream.compare = function (ks1, ks2) {
        var rest1 = ks1.rest();
        var rest2 = ks2.rest();
        if (rest1 < rest2)
            return -1;
        else if (rest1 > rest2)
            return 1;
        else
            return 0;
    };
    KeyStream.prototype.startsWith = function (prefix, beg, length) {
        var cur = this.cur;
        var s = this.s;
        if (this.len - cur < length) {
            return false;
        }
        return (s.substring(cur, cur + length) == prefix.substring(beg, beg + length));
    };
    KeyStream.prototype.rest = function () {
        return this.s.substring(this.cur);
    };
    KeyStream.prototype.read = function () {
        if (this.eos()) {
            return node_1.Node.Chck.TERMINATE_CHAR;
        }
        else {
            var p = this.cur;
            this.cur += 1;
            return this.s.charAt(p);
        }
    };
    KeyStream.prototype.eos = function () {
        return this.cur == this.len;
    };
    return KeyStream;
}());
exports.KeyStream = KeyStream;
//# sourceMappingURL=keystream.js.map