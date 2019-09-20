import { IntArray } from "./util";
import { Category } from "./category";
export declare class CharCategory {
    categories: Category[];
    char2id: IntArray;
    eqlMasks: IntArray;
    constructor(code2category: any, charcategory: any, bigendian?: any);
    category(code: string): Category;
    isCompatible(code1: string, code2: string): boolean;
    static readCategories(buffer: any, bigendian: any): Category[];
}
