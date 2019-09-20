"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("./util");
var keystream_1 = require("./keystream");
var node_1 = require("./node");
var Searcher = /** @class */ (function () {
    function Searcher(buffer, bigendian) {
        var fmis = new util_1.ArrayBufferStream(buffer, bigendian);
        var nodeSz = fmis.getInt();
        var tindSz = fmis.getInt();
        var tailSz = fmis.getInt();
        this.keySetSize = tindSz;
        this.begs = fmis.getIntArray(tindSz);
        this.base = fmis.getIntArray(nodeSz);
        this.lens = fmis.getShortArray(tindSz);
        this.chck = fmis.getCharArray(nodeSz);
        this.tail = fmis.getString(tailSz);
    }
    Searcher.prototype.size = function () {
        return this.keySetSize;
    };
    Searcher.prototype.search = function (key) {
        var base = this.base;
        var chck = this.chck;
        var node = base.get(0);
        var kin = new keystream_1.KeyStream(key);
        var code = kin.read();
        while (true) {
            var idx = node + code;
            node = base.get(idx);
            if (chck.get(idx) === code) {
                if (node >= 0) {
                    continue;
                }
                else if (kin.eos() || this.keyExists(kin, node)) {
                    return node_1.Node.Base.ID(node);
                }
            }
            return -1;
        }
    };
    Searcher.prototype.eachCommonPrefix = function (key, start, fn) {
        var _a = this, base = _a.base, chck = _a.chck;
        var node = base.get(0);
        var offset = -1;
        var kin = new keystream_1.KeyStream(key, start);
        while (true) {
            var code = kin.read().charCodeAt(0);
            offset++;
            var terminalIdx = node + node_1.Node.Chck.TERMINATE_CODE;
            if (chck.get(terminalIdx) == node_1.Node.Chck.TERMINATE_CODE) {
                fn(start, offset, node_1.Node.Base.ID(base.get(terminalIdx)));
                if (code == node_1.Node.Chck.TERMINATE_CODE) {
                    return;
                }
            }
            var idx = node + code;
            node = base.get(idx);
            if (chck.get(idx) == code) {
                if (node >= 0) {
                    continue;
                }
                else {
                    this.call_if_keyIncluding(kin, node, start, offset, fn);
                }
            }
            return;
        }
    };
    Searcher.prototype.call_if_keyIncluding = function (kin, node, start, offset, fn) {
        var nodeId = node_1.Node.Base.ID(node);
        if (kin.startsWith(this.tail, this.begs.get(nodeId), this.lens.get(nodeId))) {
            fn(start, offset + this.lens.get(nodeId) + 1, nodeId);
        }
    };
    Searcher.prototype.keyExists = function (kin, node) {
        var nodeId = node_1.Node.Base.ID(node);
        var beg = this.begs.get(nodeId);
        var s = this.tail.substring(beg, beg + this.lens.get(nodeId));
        return kin.rest() == s;
    };
    return Searcher;
}());
exports.Searcher = Searcher;
//# sourceMappingURL=searcher.js.map