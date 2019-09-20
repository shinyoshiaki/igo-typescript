export class IntArray {
  length: number;
  constructor(
    public buffer: Uint8Array,
    public pos: number,
    public elementCount: number,
    public bigendian?: boolean
  ) {
    this.length = this.elementCount;
  }

  readUInt(buffer: Uint8Array, pos: number, bigendian?: boolean) {
    const result = IntArray.readInt(buffer, pos, bigendian);
    return result >>> 0;
  }

  static readInt(buffer: Uint8Array, pos: number, bigendian?: boolean) {
    let result = 0;
    if (bigendian) {
      result =
        (buffer[pos] << 24) |
        (buffer[pos + 1] << 16) |
        (buffer[pos + 2] << 8) |
        buffer[pos + 3];
    } else {
      result =
        (buffer[pos + 3] << 24) |
        (buffer[pos + 2] << 16) |
        (buffer[pos + 1] << 8) |
        buffer[pos];
    }
    return result;
  }

  get(offset: number) {
    const pos = this.pos + offset * 4;
    return IntArray.readInt(this.buffer, pos, this.bigendian);
  }
}

export class ShortArray {
  constructor(
    public buffer: Uint8Array,
    public pos: number,
    public elementCount: number,
    public bigendian?: boolean
  ) {}

  static readUShort(buffer: Uint8Array, pos: number, bigendian?: boolean) {
    let result = 0;
    if (bigendian) {
      result = (buffer[pos] << 8) | buffer[pos + 1];
    } else {
      result = (buffer[pos + 1] << 8) | buffer[pos];
    }
    return result;
  }

  static readShort(buffer: Uint8Array, pos: number, bigendian?: boolean) {
    let result = ShortArray.readUShort(buffer, pos, bigendian);
    if (result >= 0x8000) {
      result -= 0x10000;
    }
    return result;
  }

  get(offset: number) {
    const pos = this.pos + offset * 2;
    return ShortArray.readShort(this.buffer, pos, this.bigendian);
  }
}

export class CharArray {
  constructor(
    public buffer: Uint8Array,
    public pos: number,
    public elementCount: number,
    public bigendian?: boolean
  ) {}

  get(offset: number) {
    const pos = this.pos + offset * 2;
    return ShortArray.readUShort(this.buffer, pos, this.bigendian);
  }
}

export class ArrayBufferStream {
  pos = 0;
  constructor(public buffer: Uint8Array, public bigendian?: boolean) {}
  getInt() {
    const result = IntArray.readInt(this.buffer, this.pos, this.bigendian);
    this.pos += 4;
    return result;
  }

  getIntArray(elementCount: number) {
    const array = new IntArray(
      this.buffer,
      this.pos,
      elementCount,
      this.bigendian
    );
    this.pos += elementCount * 4;
    return array;
  }

  getShortArray(elementCount: number) {
    const array = new ShortArray(
      this.buffer,
      this.pos,
      elementCount,
      this.bigendian
    );
    this.pos += elementCount * 2;
    return array;
  }

  getCharArray(elementCount: number) {
    const array = new CharArray(
      this.buffer,
      this.pos,
      elementCount,
      this.bigendian
    );
    this.pos += elementCount * 2;
    return array;
  }

  getString(elementCount: number) {
    const array = new CharArray(
      this.buffer,
      this.pos,
      elementCount,
      this.bigendian
    );
    let s = "";
    for (let i = 0; i < elementCount; i++) {
      s += String.fromCharCode(array.get(i));
    }
    this.pos += elementCount * 2;
    return s;
  }

  size() {
    return this.buffer.length;
  }
}

export function getIntArray(buffer: Uint8Array, bigendian?: boolean) {
  const stream = new ArrayBufferStream(buffer, bigendian);
  return stream.getIntArray(stream.size() / 4);
}

export function getCharArray(buffer: Uint8Array, bigendian?: boolean) {
  const stream = new ArrayBufferStream(buffer, bigendian);
  return stream.getCharArray(stream.size() / 2);
}
