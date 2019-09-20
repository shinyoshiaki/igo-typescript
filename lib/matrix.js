"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("./util");
var Matrix = /** @class */ (function () {
    function Matrix(buffer, bigendian) {
        var fmis = new util_1.ArrayBufferStream(buffer, bigendian);
        this.leftSize = fmis.getInt();
        this.rightSize = fmis.getInt();
        this.matrix = fmis.getShortArray(this.leftSize * this.rightSize);
    }
    Matrix.prototype.linkCost = function (leftId, rightId) {
        return this.matrix.get(rightId * this.leftSize + leftId);
    };
    return Matrix;
}());
exports.Matrix = Matrix;
//# sourceMappingURL=matrix.js.map