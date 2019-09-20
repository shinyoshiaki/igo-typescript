import { ArrayBufferStream, IntArray, CharArray, ShortArray } from "./util";
import { KeyStream } from "./keystream";
import { Node } from "./node";

export class Searcher {
  keySetSize: number;
  begs: IntArray;
  base: IntArray;
  lens: ShortArray;
  chck: CharArray;
  tail: string;
  constructor(buffer: Uint8Array, bigendian?: boolean) {
    const fmis = new ArrayBufferStream(buffer, bigendian);
    const nodeSz = fmis.getInt();
    const tindSz = fmis.getInt();
    const tailSz = fmis.getInt();
    this.keySetSize = tindSz;
    this.begs = fmis.getIntArray(tindSz);
    this.base = fmis.getIntArray(nodeSz);
    this.lens = fmis.getShortArray(tindSz);
    this.chck = fmis.getCharArray(nodeSz);
    this.tail = fmis.getString(tailSz);
  }

  size() {
    return this.keySetSize;
  }

  search(key: string) {
    const base = this.base;
    const chck = this.chck;

    let node = base.get(0);
    const kin = new KeyStream(key);
    const code: any = kin.read();
    while (true) {
      const idx = node + code;
      node = base.get(idx);
      if (chck.get(idx) === code) {
        if (node >= 0) {
          continue;
        } else if (kin.eos() || this.keyExists(kin, node)) {
          return Node.Base.ID(node);
        }
      }
      return -1;
    }
  }

  eachCommonPrefix(
    key: string,
    start: number,
    fn: (start: number, offset: number, trieId: number) => void
  ) {
    const { base, chck } = this;

    let node = base.get(0);
    let offset = -1;
    const kin = new KeyStream(key, start);

    while (true) {
      const code = kin.read().charCodeAt(0);
      offset++;
      const terminalIdx = node + Node.Chck.TERMINATE_CODE;
      if (chck.get(terminalIdx) == Node.Chck.TERMINATE_CODE) {
        fn(start, offset, Node.Base.ID(base.get(terminalIdx)));
        if (code == Node.Chck.TERMINATE_CODE) {
          return;
        }
      }
      const idx = node + code;
      node = base.get(idx);

      if (chck.get(idx) == code) {
        if (node >= 0) {
          continue;
        } else {
          this.call_if_keyIncluding(kin, node, start, offset, fn);
        }
      }
      return;
    }
  }

  call_if_keyIncluding(
    kin: KeyStream,
    node: number,
    start: number,
    offset: number,
    fn: any
  ) {
    const nodeId = Node.Base.ID(node);
    if (
      kin.startsWith(this.tail, this.begs.get(nodeId), this.lens.get(nodeId))
    ) {
      fn(start, offset + this.lens.get(nodeId) + 1, nodeId);
    }
  }

  keyExists(kin: KeyStream, node: number) {
    const nodeId = Node.Base.ID(node);
    const beg = this.begs.get(nodeId);
    const s = this.tail.substring(beg, beg + this.lens.get(nodeId));
    return kin.rest() == s;
  }
}
