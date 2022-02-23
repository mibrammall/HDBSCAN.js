import DataNode from "./data-node";

type Point = [x: number, y: number];

interface DistanceFunction {
  (p1: Point, p2: Point): number;
}

interface FilterFunction {
  (node: DataNode): boolean;
}

interface DataPoint {
  data: Point;
  opt: any;
}

interface NodeArgs {
  left?: DataNode;
  right?: DataNode;
  data?: Point[];
  dist?: number;
  parent?: DataNode;
  opt?: any;
  edge: any;
}

type DataSet = DataPoint[];

export type {
  Point,
  DataPoint,
  DataSet,
  DistanceFunction,
  FilterFunction,
  NodeArgs,
};
