import { ArrayBufferStream, IntArray, getIntArray } from "./util";

import { Category } from "./category";

export class CharCategory {
  categories: Category[];
  char2id: IntArray;
  eqlMasks: IntArray;
  constructor(
    code2category: ArrayBuffer | Uint8Array,
    charcategory: ArrayBuffer | Uint8Array,
    bigendian?: any
  ) {
    code2category = new Uint8Array(code2category);
    charcategory = new Uint8Array(charcategory);

    this.categories = CharCategory.readCategories(charcategory, bigendian);
    const fmis = new ArrayBufferStream(code2category as Uint8Array, bigendian);
    this.char2id = fmis.getIntArray(fmis.size() / 4 / 2);
    this.eqlMasks = fmis.getIntArray(fmis.size() / 4 / 2);
  }

  category(code: string) {
    return this.categories[this.char2id.get(code.charCodeAt(0))];
  }
  isCompatible(code1: string, code2: string) {
    return (
      (this.eqlMasks.get(code1.charCodeAt(0)) &
        this.eqlMasks.get(code2.charCodeAt(0))) !=
      0
    );
  }
  static readCategories(buffer: any, bigendian: any) {
    const data = getIntArray(buffer, bigendian);
    const size = data.length / 4;
    const ary = [];
    for (let i = 0; i < size; i++) {
      ary.push(
        new Category(
          data.get(i * 4),
          data.get(i * 4 + 1),
          data.get(i * 4 + 2) == 1,
          data.get(i * 4 + 3) == 1
        )
      );
    }
    return ary;
  }
}
