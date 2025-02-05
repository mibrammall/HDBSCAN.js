import { Point } from "./common-types";

export class Bbox {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  // a list of points [x, y]
  constructor(arr: Point[]) {
    const xs = arr.map((val) => val[0]);
    const ys = arr.map((val) => val[1]);
    this.minX = Math.min.apply(null, xs);
    this.maxX = Math.max.apply(null, xs);
    this.minY = Math.min.apply(null, ys);
    this.maxY = Math.max.apply(null, ys);
  }

  get width() {
    return this.maxX - this.minX;
  }

  get height() {
    return this.maxY - this.minY;
  }

  get center() {
    return [(this.minX + this.maxX) * 0.5, (this.minY + this.maxY) * 0.5];
  }

  intersect({ minX, maxX, minY, maxY }: Bbox) {
    const bbox = new Bbox([
      [minX, minY],
      [maxX, maxY],
    ]);
    return (
      Math.abs(this.center[0] - bbox.center[0]) <
        (this.width + bbox.width) * 0.5 &&
      Math.abs(this.center[1] - bbox.center[1]) <
        (this.height + bbox.height) * 0.5
    );
  }
}
