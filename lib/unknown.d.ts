import { CharCategory } from "./charcategory";
import { WordDic } from "./worddic";
export declare class Unknown {
    category: CharCategory;
    spaceId: number;
    constructor(category: CharCategory);
    search(text: string, start: number, wdic: WordDic, callback: any): void;
}
