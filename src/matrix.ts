import { ArrayBufferStream, ShortArray } from "./util";

export class Matrix {
  leftSize: number;
  rightSize: number;
  matrix: ShortArray;
  constructor(buffer: ArrayBuffer | Uint8Array, bigendian?: any) {
    buffer = new Uint8Array(buffer);

    const fmis = new ArrayBufferStream(buffer as Uint8Array, bigendian);
    this.leftSize = fmis.getInt();
    this.rightSize = fmis.getInt();
    this.matrix = fmis.getShortArray(this.leftSize * this.rightSize);
  }

  linkCost(leftId: number, rightId: number) {
    return this.matrix.get(rightId * this.leftSize + leftId);
  }
}
