/* eslint-disable max-len */
import Mst from "./mst";
import DataNode from "./data-node";
import { geolib } from "./geolib";
import { DataSet, DistanceFunction, Point } from "./common-types";

export class Hdbscan {
  distFunc: DistanceFunction;
  data: Point[];
  opt: any;
  constructor(dataset: DataSet, distFunc = DistanceFunctions.euclidean) {
    this.data = dataset.map((val) => val.data);
    this.opt = dataset.map((val) => val.opt);
    this.distFunc = distFunc;
  }

  getTree() {
    const data = this.data;
    const opt = this.opt;
    if (!data || !data.length) {
      throw new Error("invalid data!");
    }

    if (data.length === 1) {
      return new DataNode({
        left: undefined,
        right: undefined,
        data,
        opt,
        dist: undefined,
        parent: undefined,
        edge: undefined,
      });
    }

    const mst = new Mst(this.data, this.distFunc);
    const edges = mst.getMst();
    const nodes = data.map(
      (val, i) =>
        new DataNode({
          left: undefined,
          right: undefined,
          data: [val],
          opt: [opt[i]],
          dist: undefined,
          parent: undefined,
          edge: undefined,
        })
    );

    let root = null;
    edges
      .sort((val1, val2) => val1.dist - val2.dist)
      .forEach((val) => {
        const { edge, dist } = val;

        if (!edge) {
          return;
        }

        const nonNullEdge = edge as number[];

        const left = nodes[nonNullEdge[0]].getAncestor();
        const right = nodes[nonNullEdge[1]].getAncestor();
        const node = new DataNode({
          left,
          right,
          data: left.data.concat(right.data),
          opt: left.opt.concat(right.opt),
          dist,
          parent: undefined,
          edge: [data[nonNullEdge[0]], data[nonNullEdge[1]]],
        });

        left.parent = right.parent = root = node;
      });
    return root;
  }
}

const DistanceFunctions = {
  euclidean: (p1: Point, p2: Point): number => {
    let sum = 0;
    if (p1.length !== p2.length) {
      throw new Error("unequal dimension in input data");
    }
    for (let i = 0; i < p1.length; i += 1) {
      sum += Math.pow(p1[i] - p2[i], 2);
    }
    return Math.sqrt(sum);
  },
  geoDist: (p1: Point, p2: Point): number => {
    return geolib.getDistance(p1, p2);
  },
};
