import * as XLSX from "xlsx";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";

export interface ParsedData {
  features: string[];
  records: (string | number)[][];
}

export const parseFile = async (
  file: File,
  hasHeader: boolean = true
): Promise<ParsedData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) {
          throw new Error("ファイルの読み込みに失敗しました");
        }

        let features: string[] = [];
        let records: (string | number)[][] = [];

        // ファイルの拡張子を取得
        const fileExtension = file.name.split(".").pop()?.toLowerCase();

        if (fileExtension === "csv") {
          // CSVファイルの処理
          const text = data.toString();
          const lines = text
            .split("\n")
            .map((line) => line.trim())
            .filter((line) => line);

          if (lines.length === 0) {
            throw new Error("ファイルが空です");
          }

          const firstLine = lines[0].split(",").map((item) => item.trim());
          features = hasHeader
            ? firstLine
            : firstLine.map((_, index) => `Column ${index + 1}`);

          const startIndex = hasHeader ? 1 : 0;
          records = lines.slice(startIndex).map((line) => {
            return line.split(",").map((item) => {
              const trimmed = item.trim();
              const num = Number(trimmed);
              return isNaN(num) ? trimmed : num;
            });
          });
        } else if (["xlsx", "xls"].includes(fileExtension || "")) {
          // Excelファイルの処理
          const workbook = XLSX.read(data, { type: "binary" });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];

          // ワークシートをJSONに変換
          const jsonData = XLSX.utils.sheet_to_json(worksheet, {
            header: 1,
          }) as (string | number)[][];

          if (jsonData.length === 0) {
            throw new Error("ファイルが空です");
          }

          const firstRow = jsonData[0];
          features = hasHeader
            ? firstRow.map(String)
            : firstRow.map((_, index) => `Column ${index + 1}`);

          const startIndex = hasHeader ? 1 : 0;
          records = jsonData.slice(startIndex);
        } else {
          throw new Error("サポートされていないファイル形式です");
        }

        // データの検証
        if (records.length === 0) {
          throw new Error("データが空です");
        }

        // 各行の列数が一致することを確認
        const expectedColumns = features.length;
        records = records.filter((record) => record.length === expectedColumns);

        resolve({ features, records });
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error("ファイルの読み込みに失敗しました"));
    };

    // ファイルの種類に応じて読み込み方法を選択
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    if (["xlsx", "xls"].includes(fileExtension || "")) {
      reader.readAsArrayBuffer(file);
    } else {
      reader.readAsText(file);
    }
  });
};
