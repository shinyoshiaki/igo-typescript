export declare class ViterbiNode {
    wordId: number;
    start: number;
    length: number;
    cost: number;
    leftId: number;
    rightId: number;
    isSpace: boolean;
    nodecost: number;
    prev: ViterbiNode;
    prevs: ViterbiNode[];
    constructor(wordId: number, start: number, length: number, cost: number, leftId: number, rightId: number, isSpace: boolean);
    static makeBOSEOS(): ViterbiNode;
}
