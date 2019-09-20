"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Unknown = /** @class */ (function () {
    function Unknown(category) {
        this.category = category;
        this.spaceId = this.category.category(" ").id;
    }
    Unknown.prototype.search = function (text, start, wdic, callback) {
        var category = this.category;
        var ch = text[start];
        var ct = category.category(ch);
        var length = text.length;
        var i;
        if (!callback.isEmpty() && !ct.invoke) {
            return;
        }
        var isSpace = ct.id == this.spaceId;
        var limit = Math.min(length, ct.length + start);
        for (i = start; i < limit; i++) {
            wdic.searchFromTrieId(ct.id, start, i - start + 1, isSpace, callback);
            if (i + 1 != limit && !category.isCompatible(ch, text[i + 1])) {
                return;
            }
        }
        if (ct.group && limit < length) {
            for (i = limit; i < length; i++) {
                if (!category.isCompatible(ch, text[i])) {
                    wdic.searchFromTrieId(ct.id, start, i - start, isSpace, callback);
                    return;
                }
            }
            wdic.searchFromTrieId(ct.id, start, length - start, isSpace, callback);
        }
    };
    return Unknown;
}());
exports.Unknown = Unknown;
//# sourceMappingURL=unknown.js.map