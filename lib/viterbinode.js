"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//Viterbiアルゴリズムで使用されるノード
var ViterbiNode = /** @class */ (function () {
    function ViterbiNode(wordId, start, length, cost, leftId, rightId, isSpace) {
        this.wordId = wordId;
        this.start = start;
        this.length = length;
        this.cost = cost;
        this.leftId = leftId;
        this.rightId = rightId;
        this.isSpace = isSpace;
        this.nodecost = cost; //ノード単体のコスト
        this.prev = undefined; //コスト最小の前方のノードへのリンク
        this.prevs = []; //前方のノードへのリンク
    }
    ViterbiNode.makeBOSEOS = function () {
        return new ViterbiNode(0, 0, 0, 0, 0, 0, false);
    };
    return ViterbiNode;
}());
exports.ViterbiNode = ViterbiNode;
//# sourceMappingURL=viterbinode.js.map