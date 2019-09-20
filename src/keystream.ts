import { Node } from "./node";

export class KeyStream {
  s: string;
  cur: number;
  len: number;
  constructor(key: string, start?: number) {
    this.s = key;
    this.cur = start || 0;
    this.len = key.length;
  }

  static compare(ks1: KeyStream, ks2: KeyStream) {
    const rest1 = ks1.rest();
    const rest2 = ks2.rest();
    if (rest1 < rest2) return -1;
    else if (rest1 > rest2) return 1;
    else return 0;
  }

  startsWith(prefix: string, beg: number, length: number) {
    const cur = this.cur;
    const s = this.s;
    if (this.len - cur < length) {
      return false;
    }
    return (
      s.substring(cur, cur + length) == prefix.substring(beg, beg + length)
    );
  }

  rest() {
    return this.s.substring(this.cur);
  }

  read() {
    if (this.eos()) {
      return Node.Chck.TERMINATE_CHAR;
    } else {
      const p = this.cur;
      this.cur += 1;
      return this.s.charAt(p);
    }
  }

  eos() {
    return this.cur == this.len;
  }
}
