import { ChartData } from "../types";

export const parseCSV = (file: File): Promise<ChartData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        if (e.target && typeof e.target.result === "string") {
          const rows = e.target.result.split("\n");
          const headers = rows[0].split(",").map((h) => h.trim());

          const records: any[][] = [];

          for (let i = 1; i < rows.length; i++) {
            if (rows[i].trim() === "") continue;

            const values = rows[i].split(",").map((v, idx) => {
              const trimmed = v.trim();
              // 数値に変換可能な場合は数値として扱う
              return idx === 0 ? trimmed : Number(trimmed) || trimmed;
            });

            records.push(values);
          }

          resolve({ features: headers, records });
        }
      } catch (error) {
        reject(new Error("CSVファイルの解析に失敗しました"));
      }
    };

    reader.onerror = () => {
      reject(new Error("ファイルの読み込みに失敗しました"));
    };

    reader.readAsText(file);
  });
};

// データ型を判定する関数
export const detectColumnType = (
  values: (string | number)[]
): "number" | "string" | "date" => {
  const numbers = values.filter((v) => typeof v === "number").length;
  const dates = values.filter((v) => {
    if (typeof v === "string") {
      const date = new Date(v);
      return !isNaN(date.getTime());
    }
    return false;
  }).length;

  if (numbers === values.length) return "number";
  if (dates === values.length) return "date";
  return "string";
};
