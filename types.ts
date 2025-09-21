
export interface Cell {
  x: number;
  y: number;
  isMine: boolean;
  revealed: boolean;
}

export interface PredictionResult {
    x: number;
    y: number;
    isMine: boolean;
}
