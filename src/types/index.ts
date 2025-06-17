export type DataType = "auto" | "number" | "string" | "date";

export interface ChartData {
  features: string[];
  records: (string | number)[][];
}

export interface GraphSettings {
  xAxisFeature: string;
  yAxisFeatures: string[];
  chartType: "bar" | "line" | "pie" | "scatter" | "area" | "boxplot";
  xAxisLabel: string;
  yAxisLabel: string;
  legendPosition: "top" | "bottom" | "left" | "right";
  colorPalette: string[];
  zoom: number;
  filterFeature?: string;
  filterValue?: number | null;
  filterOperator?: ">" | "<" | "=" | ">=" | "<=";
  sortFeature?: string;
  sortOrder?: "asc" | "desc";
  dataTypes: { [key: string]: DataType };
  filters: Filter[];
}

export interface Filter {
  feature: string;
  operator: string;
  value: string | number;
  type: "and" | "or";
}

export interface SavedSettings extends GraphSettings {
  timestamp: string;
  name: string;
}

export interface AppState {
  file: File | null;
  isDragging: boolean;
  chartData: ChartData | null;
  availableFeatures: string[];
  settings: GraphSettings;
}

export type AppAction =
  | { type: "SET_FILE"; payload: File | null }
  | { type: "SET_DRAGGING"; payload: boolean }
  | {
      type: "SET_CHART_DATA";
      payload: {
        data: ChartData | null;
        defaultFeatures: { xAxis: string; yAxis: string[] };
      };
    }
  | { type: "UPDATE_SETTINGS"; payload: Partial<GraphSettings> }
  | { type: "RESET_GRAPH" };
