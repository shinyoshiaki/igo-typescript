"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsheap_1 = require("./jsheap");
var viterbinode_1 = require("./viterbinode");
var Morpheme = /** @class */ (function () {
    function Morpheme(surface, feature, start) {
        this.surface = surface;
        this.feature = feature;
        this.start = start;
    }
    return Morpheme;
}());
var Tagger = /** @class */ (function () {
    function Tagger(wdc, unk, mtx) {
        this.wdc = wdc;
        this.unk = unk;
        this.mtx = mtx;
    }
    Tagger.prototype.parse = function (text, result) {
        if (result === void 0) { result = []; }
        var vn = this.getBestPath(this.parseImpl(text));
        while (vn) {
            var surface = text.substring(vn.start, vn.start + vn.length);
            var feature = this.wdc.wordData(vn.wordId).join("");
            result.push(new Morpheme(surface, feature, vn.start));
            vn = vn.prev;
        }
        return result;
    };
    Tagger.prototype.parseNBest = function (text, best, results) {
        if (results === void 0) { results = []; }
        var vns = this.getNBestPath(this.parseImpl(text), best);
        for (var i = 0; i < vns.length; ++i) {
            var n = vns[i];
            var result = [];
            while (n) {
                var vn = n.node;
                if (vn.wordId != 0) {
                    var surface = text.substring(vn.start, vn.start + vn.length);
                    var feature = this.wdc.wordData(vn.wordId).join("");
                    result.push(new Morpheme(surface, feature, vn.start));
                }
                n = n.next;
            }
            results.push(result);
        }
        return results;
    };
    Tagger.prototype.wakati = function (text, result) {
        if (result === void 0) { result = []; }
        var vn = this.getBestPath(this.parseImpl(text));
        while (vn) {
            var surface = text.substring(vn.start, vn.start + vn.length);
            result.push(surface);
            vn = vn.prev;
        }
        return result;
    };
    Tagger.prototype.parseImpl = function (text) {
        var length = text.length;
        var nodesAry = new Array(length + 1);
        nodesAry[0] = [viterbinode_1.ViterbiNode.makeBOSEOS()];
        var _a = this, wdc = _a.wdc, unk = _a.unk;
        var tagger = this;
        var ml = new MakeLattice(nodesAry, function (vn, prevs) {
            return tagger.setMincostNode(vn, prevs);
        });
        var fn = function (vn) {
            ml.call(vn);
        };
        fn.isEmpty = function () { return ml.isEmpty(); };
        for (var i = 0; i < length; i++) {
            if (!nodesAry[i])
                continue;
            ml.set(i);
            wdc.search(text, i, fn); //単語辞書から形態素を検索
            if (unk)
                unk.search(text, i, wdc, fn); //未知語辞書から形態素を検索
        }
        nodesAry[length + 1] = [
            this.setMincostNode(viterbinode_1.ViterbiNode.makeBOSEOS(), nodesAry[length])
        ];
        return nodesAry;
    };
    Tagger.prototype.getBestPath = function (nedesAry) {
        var cur = nedesAry[nedesAry.length - 1][0].prev;
        var head = undefined;
        while (cur.prev) {
            var tmp = cur.prev;
            cur.prev = head;
            head = cur;
            cur = tmp;
        }
        return head;
    };
    Tagger.prototype.getNBestPath = function (nedesAry, best) {
        var mtx = this.mtx;
        var bests = [];
        var heap = new jsheap_1.jsheap(function (a, b) {
            return a.predict_cost < b.predict_cost;
        });
        var eos = nedesAry[nedesAry.length - 1][0];
        heap.push({ node: eos, cost: 0, predict_cost: eos.cost, next: undefined });
        while (!heap.empty() && bests.length < best) {
            var n = heap.top();
            heap.pop();
            if (n.node.wordId == 0 && n.next) {
                bests.push(n);
                continue;
            }
            var leftId = n.node.leftId;
            var prevs = n.node.prevs;
            for (var i = 0; i < prevs.length; ++i) {
                var cost = n.cost + mtx.linkCost(prevs[i].rightId, leftId) + n.node.nodecost;
                heap.push({
                    node: prevs[i],
                    cost: cost,
                    predict_cost: cost + prevs[i].cost,
                    next: n
                });
            }
        }
        return bests;
    };
    Tagger.prototype.setMincostNode = function (vn, prevs) {
        var mtx = this.mtx;
        var leftId = vn.leftId;
        var f = prevs[0];
        vn.prev = prevs[0];
        var minCost = f.cost + mtx.linkCost(f.rightId, leftId);
        for (var i = 1; i < prevs.length; i++) {
            var p = prevs[i];
            var cost = p.cost + mtx.linkCost(p.rightId, leftId);
            if (cost < minCost) {
                minCost = cost;
                vn.prev = p;
            }
        }
        vn.prevs = prevs;
        vn.cost += minCost;
        return vn;
    };
    return Tagger;
}());
exports.Tagger = Tagger;
var MakeLattice = /** @class */ (function () {
    function MakeLattice(nodesAry, setMincostNode) {
        this.nodesAry = nodesAry;
        this.setMincostNode = setMincostNode;
        this.i = 0;
        this.prevs = undefined;
        this.empty = true;
    }
    MakeLattice.prototype.set = function (i) {
        this.i = i;
        this.prevs = this.nodesAry[i];
        this.nodesAry[i] = undefined;
        this.empty = true;
    };
    MakeLattice.prototype.call = function (vn) {
        this.empty = false;
        var nodesAry = this.nodesAry;
        var end = this.i + vn.length;
        var ends = nodesAry[end] || [];
        if (vn.isSpace) {
            ends = ends.concat(this.prevs);
        }
        else {
            ends.push(this.setMincostNode(vn, this.prevs));
        }
        nodesAry[end] = ends;
    };
    MakeLattice.prototype.isEmpty = function () {
        return this.empty;
    };
    return MakeLattice;
}());
//# sourceMappingURL=tagger.js.map