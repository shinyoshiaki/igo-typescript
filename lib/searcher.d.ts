import { IntArray, CharArray, ShortArray } from "./util";
import { KeyStream } from "./keystream";
export declare class Searcher {
    keySetSize: number;
    begs: IntArray;
    base: IntArray;
    lens: ShortArray;
    chck: CharArray;
    tail: string;
    constructor(buffer: Uint8Array, bigendian?: boolean);
    size(): number;
    search(key: string): number;
    eachCommonPrefix(key: string, start: number, fn: (start: number, offset: number, trieId: number) => void): void;
    call_if_keyIncluding(kin: KeyStream, node: number, start: number, offset: number, fn: any): void;
    keyExists(kin: KeyStream, node: number): boolean;
}
