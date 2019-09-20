export declare class KeyStream {
    s: string;
    cur: number;
    len: number;
    constructor(key: string, start?: number);
    static compare(ks1: KeyStream, ks2: KeyStream): 0 | 1 | -1;
    startsWith(prefix: string, beg: number, length: number): boolean;
    rest(): string;
    read(): string;
    eos(): boolean;
}
