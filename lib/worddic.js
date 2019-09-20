"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("./util");
var searcher_1 = require("./searcher");
var viterbinode_1 = require("./viterbinode");
var WordDic = /** @class */ (function () {
    function WordDic(word2id, worddat, wordary, wordinf, bigendian) {
        this.trie = new searcher_1.Searcher(new Uint8Array(word2id), bigendian);
        this.data = util_1.getCharArray(new Uint8Array(worddat), bigendian);
        this.indices = util_1.getIntArray(new Uint8Array(wordary), bigendian);
        var fmis = new util_1.ArrayBufferStream(new Uint8Array(wordinf), bigendian);
        var wordCount = fmis.size() / (4 + 2 + 2 + 2);
        //dataOffsets[単語ID] = 単語の素性データの開始位置
        this.dataOffsets = fmis.getIntArray(wordCount);
        //leftIds[単語ID] = 単語の左文脈ID
        this.leftIds = fmis.getShortArray(wordCount);
        //rightIds[単語ID] = 単語の右文脈ID
        this.rightIds = fmis.getShortArray(wordCount);
        //consts[単語ID] = 単語のコスト
        this.costs = fmis.getShortArray(wordCount);
    }
    WordDic.prototype.search = function (text, start, callback) {
        var _a = this, costs = _a.costs, leftIds = _a.leftIds, rightIds = _a.rightIds, indices = _a.indices;
        this.trie.eachCommonPrefix(text, start, function (start, offset, trieId) {
            var end = indices.get(trieId + 1);
            for (var i = indices.get(trieId); i < end; i++) {
                callback(new viterbinode_1.ViterbiNode(i, start, offset, costs.get(i), leftIds.get(i), rightIds.get(i), false));
            }
        });
    };
    WordDic.prototype.searchFromTrieId = function (trieId, start, wordLength, isSpace, callback) {
        var costs = this.costs;
        var leftIds = this.leftIds;
        var rightIds = this.rightIds;
        var end = this.indices.get(trieId + 1);
        for (var i = this.indices.get(trieId); i < end; i++) {
            callback(new viterbinode_1.ViterbiNode(i, start, wordLength, costs.get(i), leftIds.get(i), rightIds.get(i), isSpace));
        }
    };
    WordDic.prototype.wordData = function (wordId) {
        var res = Array();
        var start = this.dataOffsets.get(wordId);
        var end = this.dataOffsets.get(wordId + 1);
        for (var i = start; i < end; i++) {
            res.push(String.fromCharCode(this.data.get(i)));
        }
        return res;
    };
    return WordDic;
}());
exports.WordDic = WordDic;
//# sourceMappingURL=worddic.js.map