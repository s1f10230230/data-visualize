import React from "react";
import { Card, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  fileName: string | null;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, fileName }) => {
  const [isDragging, setIsDragging] = React.useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.type === "text/csv" || file.name.endsWith(".csv")) {
      onFileSelect(file);
      message.success(`${file.name}がアップロードされました`);
    } else {
      message.error("CSVファイルのみアップロード可能です");
    }
  };

  return (
    <Card className="card fade-in">
      <div
        className={`upload-area ${isDragging ? "dragging" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById("file-upload-input")?.click()}
      >
        <UploadOutlined className="text-5xl text-gray-400 mb-4" />
        <p className="text-center text-gray-600 mb-2">
          CSVファイルをドラッグ＆ドロップ、または選択
        </p>
        <p className="text-xs text-gray-400">
          {fileName || "ファイルが選択されていません"}
        </p>
        <input
          id="file-upload-input"
          type="file"
          accept=".csv"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </Card>
  );
};

export default FileUpload;
