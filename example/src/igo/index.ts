import { CharCategory, Matrix, Tagger, Unknown, WordDic } from "../../../src";

export const loadTagger = () =>
  new Promise<Tagger>(async r => {
    const char = (await import("./char.category")).default;
    const code2category = (await import("./code2category.bin")).default;
    const category = new CharCategory(code2category, char);
    const word2id = (await import("./word2id.bin")).default;
    const wordary = (await import("./word.ary.idx")).default;
    const worddat = (await import("./word.dat")).default;
    const wordinf = (await import("./word.inf")).default;
    const wdc = new WordDic(word2id, worddat, wordary, wordinf);
    const unk = new Unknown(category);
    const matrix = (await import("./matrix.bin")).default;
    const mtx = new Matrix(matrix);
    r(new Tagger(wdc, unk, mtx));
  });
