import { WordDic } from "./worddic";
import { Unknown } from "./unknown";
import { Matrix } from "./matrix";
import { ViterbiNode } from "./viterbinode";
declare class Morpheme {
    surface: string;
    feature: string;
    start: number;
    constructor(surface: string, feature: string, start: number);
}
export declare class Tagger {
    wdc: WordDic;
    unk: Unknown;
    mtx: Matrix;
    constructor(wdc: WordDic, unk: Unknown, mtx: Matrix);
    parse(text: string, result?: Morpheme[]): Morpheme[];
    parseNBest(text: string, best: number, results?: Morpheme[][]): Morpheme[][];
    wakati(text: string, result?: string[]): string[];
    parseImpl(text: string): ViterbiNode[][];
    getBestPath(nedesAry: ViterbiNode[][]): ViterbiNode | undefined;
    getNBestPath(nedesAry: ViterbiNode[][], best: number): any[];
    setMincostNode(vn: ViterbiNode, prevs: ViterbiNode[]): ViterbiNode;
}
export {};
