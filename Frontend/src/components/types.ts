export interface Route {
  summary: string;
  legs: {
    distance: {
      value: number;
      text: string;
    };
    duration: {
      value: number;
      text: string;
    };
  }[];
}
