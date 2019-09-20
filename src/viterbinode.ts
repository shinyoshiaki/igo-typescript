//Viterbiアルゴリズムで使用されるノード
export class ViterbiNode {
  nodecost: number;
  prev: ViterbiNode;
  prevs: ViterbiNode[];
  constructor(
    public wordId: number,
    public start: number,
    public length: number,
    public cost: number,
    public leftId: number,
    public rightId: number,
    public isSpace: boolean
  ) {
    this.nodecost = cost; //ノード単体のコスト
    this.prev = undefined as any; //コスト最小の前方のノードへのリンク
    this.prevs = []; //前方のノードへのリンク
  }

  static makeBOSEOS() {
    return new ViterbiNode(0, 0, 0, 0, 0, 0, false);
  }
}
