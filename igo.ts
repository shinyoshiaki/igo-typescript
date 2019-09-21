import { CharCategory } from "./src/charcategory";
import { Matrix } from "./src/matrix";
import { Tagger } from "./src/tagger";
import { Unknown } from "./src/unknown";
import { WordDic } from "./src/worddic";

const fs = require("fs");

function loadTagger(dicdir: string) {
  const dicfiles = [
    "char.category",
    "code2category",
    "word2id",
    "word.dat",
    "word.ary.idx",
    "word.inf",
    "matrix.bin"
  ];
  const files: { [key: string]: ArrayBuffer } = {};
  for (let i = 0; i < dicfiles.length; ++i) {
    files[dicfiles[i]] = fs.readFileSync(dicdir + "/" + dicfiles[i]);
  }
  const category = new CharCategory(
    files["code2category"],
    files["char.category"]
  );

  const wdc = new WordDic(
    files["word2id"],
    files["word.dat"],
    files["word.ary.idx"],
    files["word.inf"]
  );
  const unk = new Unknown(category);
  const mtx = new Matrix(files["matrix.bin"]);
  return new Tagger(wdc, unk, mtx);
}

const tagger = loadTagger("./skkdic");

console.log(tagger.parseNBest("あんど", 10));
