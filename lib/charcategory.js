"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("./util");
var category_1 = require("./category");
var CharCategory = /** @class */ (function () {
    function CharCategory(code2category, charcategory, bigendian) {
        this.categories = CharCategory.readCategories(charcategory, bigendian);
        var fmis = new util_1.ArrayBufferStream(code2category, bigendian);
        this.char2id = fmis.getIntArray(fmis.size() / 4 / 2);
        this.eqlMasks = fmis.getIntArray(fmis.size() / 4 / 2);
    }
    CharCategory.prototype.category = function (code) {
        return this.categories[this.char2id.get(code.charCodeAt(0))];
    };
    CharCategory.prototype.isCompatible = function (code1, code2) {
        return ((this.eqlMasks.get(code1.charCodeAt(0)) &
            this.eqlMasks.get(code2.charCodeAt(0))) !=
            0);
    };
    CharCategory.readCategories = function (buffer, bigendian) {
        var data = util_1.getIntArray(buffer, bigendian);
        var size = data.length / 4;
        var ary = [];
        for (var i = 0; i < size; i++) {
            ary.push(new category_1.Category(data.get(i * 4), data.get(i * 4 + 1), data.get(i * 4 + 2) == 1, data.get(i * 4 + 3) == 1));
        }
        return ary;
    };
    return CharCategory;
}());
exports.CharCategory = CharCategory;
//# sourceMappingURL=charcategory.js.map