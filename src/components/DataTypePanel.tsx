import React from "react";
import { Card, Select, Button, Space, Form, Input, Radio } from "antd";
import type { DataType } from "../types";

const { Option } = Select;

interface DataTypePanelProps {
  features: string[];
  dataTypes: { [key: string]: DataType };
  onDataTypeChange: (feature: string, type: DataType) => void;
  onFilterChange: (filters: Filter[]) => void;
}

export interface Filter {
  feature: string;
  operator: string;
  value: string | number;
  type: "and" | "or";
}

const DataTypePanel: React.FC<DataTypePanelProps> = ({
  features,
  dataTypes,
  onDataTypeChange,
  onFilterChange,
}) => {
  const [form] = Form.useForm();
  const [filters, setFilters] = React.useState<Filter[]>([]);

  const handleAddFilter = () => {
    const values = form.getFieldsValue();
    const newFilter: Filter = {
      feature: values.feature,
      operator: values.operator,
      value: values.value,
      type: values.type || "and",
    };
    const newFilters = [...filters, newFilter];
    setFilters(newFilters);
    onFilterChange(newFilters);
    form.resetFields();
  };

  const handleRemoveFilter = (index: number) => {
    const newFilters = filters.filter((_, i) => i !== index);
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const getOperators = (type: DataType) => {
    switch (type) {
      case "number":
        return [
          { value: ">", label: "より大きい" },
          { value: "<", label: "より小さい" },
          { value: "=", label: "等しい" },
          { value: ">=", label: "以上" },
          { value: "<=", label: "以下" },
        ];
      case "string":
        return [
          { value: "contains", label: "を含む" },
          { value: "startsWith", label: "で始まる" },
          { value: "endsWith", label: "で終わる" },
          { value: "=", label: "等しい" },
        ];
      case "date":
        return [
          { value: ">", label: "より後" },
          { value: "<", label: "より前" },
          { value: "=", label: "等しい" },
        ];
      default:
        return [];
    }
  };

  return (
    <Card className="card fade-in">
      <h3 className="text-lg font-semibold mb-4">データ型とフィルター</h3>

      <div className="space-y-4">
        <div>
          <h4 className="text-md font-medium mb-2">データ型の設定</h4>
          {features.map((feature) => (
            <div key={feature} className="mb-2">
              <label className="block text-sm mb-1">{feature}</label>
              <Select
                value={dataTypes[feature] || "auto"}
                onChange={(value) =>
                  onDataTypeChange(feature, value as DataType)
                }
                className="w-full"
              >
                <Option value="auto">自動判別</Option>
                <Option value="number">数値</Option>
                <Option value="string">文字列</Option>
                <Option value="date">日付</Option>
              </Select>
            </div>
          ))}
        </div>

        <div>
          <h4 className="text-md font-medium mb-2">フィルター</h4>
          <Form form={form} layout="vertical">
            <Form.Item name="feature" label="列">
              <Select>
                {features.map((feature) => (
                  <Option key={feature} value={feature}>
                    {feature}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="operator" label="演算子">
              <Select>
                {getOperators(
                  dataTypes[form.getFieldValue("feature")] || "auto"
                ).map((op) => (
                  <Option key={op.value} value={op.value}>
                    {op.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="value" label="値">
              <Input />
            </Form.Item>

            <Form.Item name="type" label="条件の結合">
              <Radio.Group>
                <Radio value="and">AND</Radio>
                <Radio value="or">OR</Radio>
              </Radio.Group>
            </Form.Item>

            <Button type="primary" onClick={handleAddFilter}>
              フィルターを追加
            </Button>
          </Form>

          <div className="mt-4">
            {filters.map((filter, index) => (
              <div
                key={index}
                className="flex items-center justify-between mb-2 p-2 bg-gray-50 rounded"
              >
                <span>
                  {filter.feature} {filter.operator} {filter.value}
                  {index < filters.length - 1 &&
                    ` ${filter.type.toUpperCase()}`}
                </span>
                <Button
                  type="link"
                  danger
                  onClick={() => handleRemoveFilter(index)}
                >
                  削除
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DataTypePanel;
