export interface ChartData {
  features: string[];
  records: (string | number)[][];
}

export interface GraphSettings {
  chartType: string;
  xAxisFeature: string;
  yAxisFeatures: string[];
  xAxisLabel: string;
  yAxisLabel: string;
  legendPosition: string;
  colorPalette: string[];
  zoom: number;
  filterFeature: string;
  filterOperator: string;
  filterValue: number | null;
  sortFeature: string;
  sortOrder: "asc" | "desc";
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
