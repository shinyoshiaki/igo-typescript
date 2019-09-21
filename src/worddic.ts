import {
  ArrayBufferStream,
  CharArray,
  IntArray,
  ShortArray,
  getCharArray,
  getIntArray
} from "./util";

import { Searcher } from "./searcher";
import { ViterbiNode } from "./viterbinode";

export class WordDic {
  trie: Searcher;
  data: CharArray;
  indices: IntArray;
  dataOffsets: IntArray;
  leftIds: ShortArray;
  rightIds: ShortArray;
  costs: ShortArray;
  constructor(
    word2id: ArrayBuffer | Uint8Array,
    worddat: ArrayBuffer | Uint8Array,
    wordary: ArrayBuffer | Uint8Array,
    wordinf: ArrayBuffer | Uint8Array,
    bigendian?: boolean
  ) {
    word2id = new Uint8Array(word2id);
    worddat = new Uint8Array(worddat);
    wordary = new Uint8Array(wordary);
    wordinf = new Uint8Array(wordinf);

    this.trie = new Searcher(word2id as Uint8Array, bigendian);
    this.data = getCharArray(worddat as Uint8Array, bigendian);
    this.indices = getIntArray(wordary as Uint8Array, bigendian);

    const fmis = new ArrayBufferStream(wordinf as Uint8Array, bigendian);
    const wordCount = fmis.size() / (4 + 2 + 2 + 2);

    //dataOffsets[単語ID] = 単語の素性データの開始位置
    this.dataOffsets = fmis.getIntArray(wordCount);

    //leftIds[単語ID] = 単語の左文脈ID
    this.leftIds = fmis.getShortArray(wordCount);

    //rightIds[単語ID] = 単語の右文脈ID
    this.rightIds = fmis.getShortArray(wordCount);

    //consts[単語ID] = 単語のコスト
    this.costs = fmis.getShortArray(wordCount);
  }

  search(text: string, start: number, callback: (vn: ViterbiNode) => void) {
    const { costs, leftIds, rightIds, indices } = this;

    this.trie.eachCommonPrefix(
      text,
      start,
      (start: number, offset: number, trieId: number) => {
        const end = indices.get(trieId + 1);
        for (let i = indices.get(trieId); i < end; i++) {
          callback(
            new ViterbiNode(
              i,
              start,
              offset,
              costs.get(i),
              leftIds.get(i),
              rightIds.get(i),
              false
            )
          );
        }
      }
    );
  }

  searchFromTrieId(
    trieId: number,
    start: number,
    wordLength: number,
    isSpace: boolean,
    callback: any
  ) {
    const costs = this.costs;
    const leftIds = this.leftIds;
    const rightIds = this.rightIds;
    const end = this.indices.get(trieId + 1);
    for (let i = this.indices.get(trieId); i < end; i++) {
      callback(
        new ViterbiNode(
          i,
          start,
          wordLength,
          costs.get(i),
          leftIds.get(i),
          rightIds.get(i),
          isSpace
        )
      );
    }
  }

  wordData(wordId: number) {
    const res = Array();
    const start = this.dataOffsets.get(wordId);
    const end = this.dataOffsets.get(wordId + 1);
    for (let i = start; i < end; i++) {
      res.push(String.fromCharCode(this.data.get(i)));
    }
    return res;
  }
}
