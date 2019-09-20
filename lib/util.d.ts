export declare class IntArray {
    buffer: Uint8Array;
    pos: number;
    elementCount: number;
    bigendian?: boolean | undefined;
    length: number;
    constructor(buffer: Uint8Array, pos: number, elementCount: number, bigendian?: boolean | undefined);
    readUInt(buffer: Uint8Array, pos: number, bigendian?: boolean): number;
    static readInt(buffer: Uint8Array, pos: number, bigendian?: boolean): number;
    get(offset: number): number;
}
export declare class ShortArray {
    buffer: Uint8Array;
    pos: number;
    elementCount: number;
    bigendian?: boolean | undefined;
    constructor(buffer: Uint8Array, pos: number, elementCount: number, bigendian?: boolean | undefined);
    static readUShort(buffer: Uint8Array, pos: number, bigendian?: boolean): number;
    static readShort(buffer: Uint8Array, pos: number, bigendian?: boolean): number;
    get(offset: number): number;
}
export declare class CharArray {
    buffer: Uint8Array;
    pos: number;
    elementCount: number;
    bigendian?: boolean | undefined;
    constructor(buffer: Uint8Array, pos: number, elementCount: number, bigendian?: boolean | undefined);
    get(offset: number): number;
}
export declare class ArrayBufferStream {
    buffer: Uint8Array;
    bigendian?: boolean | undefined;
    pos: number;
    constructor(buffer: Uint8Array, bigendian?: boolean | undefined);
    getInt(): number;
    getIntArray(elementCount: number): IntArray;
    getShortArray(elementCount: number): ShortArray;
    getCharArray(elementCount: number): CharArray;
    getString(elementCount: number): string;
    size(): number;
}
export declare function getIntArray(buffer: Uint8Array, bigendian?: boolean): IntArray;
export declare function getCharArray(buffer: Uint8Array, bigendian?: boolean): CharArray;
