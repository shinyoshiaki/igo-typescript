import { CharCategory } from "./charcategory";
import { WordDic } from "./worddic";

export class Unknown {
  spaceId: number;
  constructor(public category: CharCategory) {
    this.spaceId = this.category.category(" ").id;
  }
  search(text: string, start: number, wdic: WordDic, callback: any) {
    const category = this.category;
    const ch = text[start];
    const ct = category.category(ch);
    const length = text.length;
    let i: number;

    if (!callback.isEmpty() && !ct.invoke) {
      return;
    }

    const isSpace = ct.id == this.spaceId;
    const limit = Math.min(length, ct.length + start);
    for (i = start; i < limit; i++) {
      wdic.searchFromTrieId(ct.id, start, i - start + 1, isSpace, callback);
      if (i + 1 != limit && !category.isCompatible(ch, text[i + 1])) {
        return;
      }
    }

    if (ct.group && limit < length) {
      for (i = limit; i < length; i++) {
        if (!category.isCompatible(ch, text[i])) {
          wdic.searchFromTrieId(ct.id, start, i - start, isSpace, callback);
          return;
        }
      }
      wdic.searchFromTrieId(ct.id, start, length - start, isSpace, callback);
    }
  }
}
