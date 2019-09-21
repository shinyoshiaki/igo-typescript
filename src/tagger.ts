import { Matrix } from "./matrix";
import { Unknown } from "./unknown";
import { ViterbiNode } from "./viterbinode";
import { WordDic } from "./worddic";
import { jsheap } from "./jsheap";

export class Morpheme {
  constructor(
    public surface: string,
    public feature: string,
    public start: number
  ) {}
}

export class Tagger {
  constructor(public wdc: WordDic, public unk: Unknown, public mtx: Matrix) {}

  parse(text: string, result: Morpheme[] = []) {
    let vn = this.getBestPath(this.parseImpl(text));
    while (vn) {
      const surface = text.substring(vn.start, vn.start + vn.length);
      const feature = this.wdc.wordData(vn.wordId).join("");
      result.push(new Morpheme(surface, feature, vn.start));
      vn = vn.prev;
    }
    return result;
  }

  parseNBest(text: string, best: number, results: Morpheme[][] = []) {
    const vns = this.getNBestPath(this.parseImpl(text), best);
    for (let i = 0; i < vns.length; ++i) {
      let n = vns[i];
      const result = [];
      while (n) {
        const vn = n.node;
        if (vn.wordId != 0) {
          const surface = text.substring(vn.start, vn.start + vn.length);
          const feature = this.wdc.wordData(vn.wordId).join("");
          result.push(new Morpheme(surface, feature, vn.start));
        }
        n = n.next;
      }
      results.push(result);
    }
    return results;
  }

  wakati(text: string, result: string[] = []) {
    let vn = this.getBestPath(this.parseImpl(text));
    while (vn) {
      const surface = text.substring(vn.start, vn.start + vn.length);
      result.push(surface);
      vn = vn.prev;
    }
    return result;
  }

  parseImpl(text: string) {
    const length = text.length;
    const nodesAry: ViterbiNode[][] = new Array(length + 1);
    nodesAry[0] = [ViterbiNode.makeBOSEOS()];

    const { wdc, unk } = this;
    const tagger = this;

    const ml = new MakeLattice(nodesAry, (vn: ViterbiNode, prevs) =>
      tagger.setMincostNode(vn, prevs)
    );

    const fn = (vn: ViterbiNode) => {
      ml.call(vn);
    };
    fn.isEmpty = () => ml.isEmpty();

    for (let i = 0; i < length; i++) {
      if (!nodesAry[i]) continue;
      ml.set(i);
      wdc.search(text, i, fn); //単語辞書から形態素を検索
      if (unk) unk.search(text, i, wdc, fn); //未知語辞書から形態素を検索
    }

    nodesAry[length + 1] = [
      this.setMincostNode(ViterbiNode.makeBOSEOS(), nodesAry[length])
    ];
    return nodesAry;
  }

  getBestPath(nedesAry: ViterbiNode[][]) {
    let cur = nedesAry[nedesAry.length - 1][0].prev;
    let head = undefined;
    while (cur.prev) {
      const tmp = cur.prev;
      cur.prev = head as any;
      head = cur;
      cur = tmp;
    }
    return head;
  }

  getNBestPath(nedesAry: ViterbiNode[][], best: number) {
    const mtx = this.mtx;
    const bests = [];
    const heap = new jsheap((a: any, b: any) => {
      return a.predict_cost < b.predict_cost;
    });
    const eos = nedesAry[nedesAry.length - 1][0];
    heap.push({ node: eos, cost: 0, predict_cost: eos.cost, next: undefined });
    while (!heap.empty() && bests.length < best) {
      const n = heap.top();
      heap.pop();
      if (n.node.wordId == 0 && n.next) {
        bests.push(n);
        continue;
      }

      const leftId = n.node.leftId;
      const prevs = n.node.prevs;
      for (let i = 0; i < prevs.length; ++i) {
        const cost =
          n.cost + mtx.linkCost(prevs[i].rightId, leftId) + n.node.nodecost;
        heap.push({
          node: prevs[i],
          cost: cost,
          predict_cost: cost + prevs[i].cost,
          next: n
        });
      }
    }
    return bests;
  }

  setMincostNode(vn: ViterbiNode, prevs: ViterbiNode[]) {
    const mtx = this.mtx;
    const leftId = vn.leftId;
    const f = prevs[0];
    vn.prev = prevs[0];
    let minCost = f.cost + mtx.linkCost(f.rightId, leftId);

    for (let i = 1; i < prevs.length; i++) {
      const p = prevs[i];
      const cost = p.cost + mtx.linkCost(p.rightId, leftId);
      if (cost < minCost) {
        minCost = cost;
        vn.prev = p;
      }
    }
    vn.prevs = prevs;
    vn.cost += minCost;
    return vn;
  }
}

class MakeLattice {
  i: number;
  prevs: ViterbiNode[];
  empty: boolean;
  constructor(
    public nodesAry: ViterbiNode[][],
    public setMincostNode: (
      vn: ViterbiNode,
      prevs: ViterbiNode[]
    ) => ViterbiNode
  ) {
    this.i = 0;
    this.prevs = undefined as any;
    this.empty = true;
  }

  set(i: number) {
    this.i = i;
    this.prevs = this.nodesAry[i];
    this.nodesAry[i] = undefined as any;
    this.empty = true;
  }

  call(vn: ViterbiNode) {
    this.empty = false;
    const nodesAry = this.nodesAry;
    const end = this.i + vn.length;
    let ends = nodesAry[end] || [];
    if (vn.isSpace) {
      ends = ends.concat(this.prevs);
    } else {
      ends.push(this.setMincostNode(vn, this.prevs));
    }
    nodesAry[end] = ends;
  }

  isEmpty() {
    return this.empty;
  }
}
