export declare class jsheap {
    cmp?: any;
    heap: any[];
    constructor(cmp?: any);
    push(item: any): this;
    top(): any;
    pop(): this;
    empty(): boolean;
}
