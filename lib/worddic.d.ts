/// <reference types="node" />
import { ShortArray, IntArray, CharArray } from "./util";
import { Searcher } from "./searcher";
import { ViterbiNode } from "./viterbinode";
export declare class WordDic {
    trie: Searcher;
    data: CharArray;
    indices: IntArray;
    dataOffsets: IntArray;
    leftIds: ShortArray;
    rightIds: ShortArray;
    costs: ShortArray;
    constructor(word2id: Buffer, worddat: Buffer, wordary: Buffer, wordinf: Buffer, bigendian?: boolean);
    search(text: string, start: number, callback: (vn: ViterbiNode) => void): void;
    searchFromTrieId(trieId: number, start: number, wordLength: number, isSpace: boolean, callback: any): void;
    wordData(wordId: number): any[];
}
