export class jsheap {
  heap: any[];
  constructor(public cmp?: any) {
    //Compare function
    this.cmp = cmp || default_cmp;

    // heap[0] is dummpy
    this.heap = [null];
  }

  push(item: any) {
    const heap = this.heap;
    const cmp = this.cmp;
    let i = heap.length;
    let j;

    heap.push(item);
    while (i > 1 && cmp(heap[i], heap[(j = (i / 2) | 0)])) {
      swap(heap, i, j);
      i = j;
    }
    return this;
  }

  top() {
    return this.heap[1];
  }

  pop() {
    if (this.empty()) throw new Error("heap is empty");
    const heap = this.heap;
    const cmp = this.cmp;
    let i: number;
    const item = heap.pop();
    const length = heap.length;
    if (length == 1) return this;

    i = 1;
    heap[1] = item;

    while (i * 2 < length) {
      let j = i * 2;
      if (j + 1 < length && cmp(heap[j + 1], heap[j])) {
        ++j;
      }
      if (!cmp(heap[j], heap[i])) {
        break;
      }
      swap(heap, i, j);
      i = j;
    }

    return this;
  }

  empty() {
    return this.heap.length <= 1;
  }
}

function default_cmp(a: number, b: number) {
  return a < b;
}

function swap<T>(heap: T[], a: number, b: number) {
  const tmp = heap[a];
  heap[a] = heap[b];
  heap[b] = tmp;
}
