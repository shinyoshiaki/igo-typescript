"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IntArray = /** @class */ (function () {
    function IntArray(buffer, pos, elementCount, bigendian) {
        this.buffer = buffer;
        this.pos = pos;
        this.elementCount = elementCount;
        this.bigendian = bigendian;
        this.length = this.elementCount;
    }
    IntArray.prototype.readUInt = function (buffer, pos, bigendian) {
        var result = IntArray.readInt(buffer, pos, bigendian);
        return result >>> 0;
    };
    IntArray.readInt = function (buffer, pos, bigendian) {
        var result = 0;
        if (bigendian) {
            result =
                (buffer[pos] << 24) |
                    (buffer[pos + 1] << 16) |
                    (buffer[pos + 2] << 8) |
                    buffer[pos + 3];
        }
        else {
            result =
                (buffer[pos + 3] << 24) |
                    (buffer[pos + 2] << 16) |
                    (buffer[pos + 1] << 8) |
                    buffer[pos];
        }
        return result;
    };
    IntArray.prototype.get = function (offset) {
        var pos = this.pos + offset * 4;
        return IntArray.readInt(this.buffer, pos, this.bigendian);
    };
    return IntArray;
}());
exports.IntArray = IntArray;
var ShortArray = /** @class */ (function () {
    function ShortArray(buffer, pos, elementCount, bigendian) {
        this.buffer = buffer;
        this.pos = pos;
        this.elementCount = elementCount;
        this.bigendian = bigendian;
    }
    ShortArray.readUShort = function (buffer, pos, bigendian) {
        var result = 0;
        if (bigendian) {
            result = (buffer[pos] << 8) | buffer[pos + 1];
        }
        else {
            result = (buffer[pos + 1] << 8) | buffer[pos];
        }
        return result;
    };
    ShortArray.readShort = function (buffer, pos, bigendian) {
        var result = ShortArray.readUShort(buffer, pos, bigendian);
        if (result >= 0x8000) {
            result -= 0x10000;
        }
        return result;
    };
    ShortArray.prototype.get = function (offset) {
        var pos = this.pos + offset * 2;
        return ShortArray.readShort(this.buffer, pos, this.bigendian);
    };
    return ShortArray;
}());
exports.ShortArray = ShortArray;
var CharArray = /** @class */ (function () {
    function CharArray(buffer, pos, elementCount, bigendian) {
        this.buffer = buffer;
        this.pos = pos;
        this.elementCount = elementCount;
        this.bigendian = bigendian;
    }
    CharArray.prototype.get = function (offset) {
        var pos = this.pos + offset * 2;
        return ShortArray.readUShort(this.buffer, pos, this.bigendian);
    };
    return CharArray;
}());
exports.CharArray = CharArray;
var ArrayBufferStream = /** @class */ (function () {
    function ArrayBufferStream(buffer, bigendian) {
        this.buffer = buffer;
        this.bigendian = bigendian;
        this.pos = 0;
    }
    ArrayBufferStream.prototype.getInt = function () {
        var result = IntArray.readInt(this.buffer, this.pos, this.bigendian);
        this.pos += 4;
        return result;
    };
    ArrayBufferStream.prototype.getIntArray = function (elementCount) {
        var array = new IntArray(this.buffer, this.pos, elementCount, this.bigendian);
        this.pos += elementCount * 4;
        return array;
    };
    ArrayBufferStream.prototype.getShortArray = function (elementCount) {
        var array = new ShortArray(this.buffer, this.pos, elementCount, this.bigendian);
        this.pos += elementCount * 2;
        return array;
    };
    ArrayBufferStream.prototype.getCharArray = function (elementCount) {
        var array = new CharArray(this.buffer, this.pos, elementCount, this.bigendian);
        this.pos += elementCount * 2;
        return array;
    };
    ArrayBufferStream.prototype.getString = function (elementCount) {
        var array = new CharArray(this.buffer, this.pos, elementCount, this.bigendian);
        var s = "";
        for (var i = 0; i < elementCount; i++) {
            s += String.fromCharCode(array.get(i));
        }
        this.pos += elementCount * 2;
        return s;
    };
    ArrayBufferStream.prototype.size = function () {
        return this.buffer.length;
    };
    return ArrayBufferStream;
}());
exports.ArrayBufferStream = ArrayBufferStream;
function getIntArray(buffer, bigendian) {
    var stream = new ArrayBufferStream(buffer, bigendian);
    return stream.getIntArray(stream.size() / 4);
}
exports.getIntArray = getIntArray;
function getCharArray(buffer, bigendian) {
    var stream = new ArrayBufferStream(buffer, bigendian);
    return stream.getCharArray(stream.size() / 2);
}
exports.getCharArray = getCharArray;
//# sourceMappingURL=util.js.map