import { ShortArray } from "./util";
export declare class Matrix {
    leftSize: number;
    rightSize: number;
    matrix: ShortArray;
    constructor(buffer: Uint8Array, bigendian?: any);
    linkCost(leftId: number, rightId: number): number;
}
