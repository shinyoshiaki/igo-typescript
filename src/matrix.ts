import { ArrayBufferStream, ShortArray } from "./util";

export class Matrix {
  leftSize: number;
  rightSize: number;
  matrix: ShortArray;
  constructor(buffer: Uint8Array, bigendian?: any) {
    const fmis = new ArrayBufferStream(buffer, bigendian);
    this.leftSize = fmis.getInt();
    this.rightSize = fmis.getInt();
    this.matrix = fmis.getShortArray(this.leftSize * this.rightSize);
  }

  linkCost(leftId: number, rightId: number) {
    return this.matrix.get(rightId * this.leftSize + leftId);
  }
}
