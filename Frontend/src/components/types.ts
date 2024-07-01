export interface Route {
  summary: string;
  legs: {
    distance: {
      text: string;
      value: number;
    };
  }[];
}
