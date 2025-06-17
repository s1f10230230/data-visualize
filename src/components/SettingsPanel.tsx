import React, { useState } from "react";
import { Card, Select, Button, Space, message, Modal, List } from "antd";
import {
  SaveOutlined,
  FolderOpenOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import type { GraphSettings } from "../types";

const { Option } = Select;

interface SettingsPanelProps {
  settings: GraphSettings;
  availableFeatures: string[];
  onSettingsChange: (settings: Partial<GraphSettings>) => void;
  onReset: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  settings,
  availableFeatures,
  onSettingsChange,
  onReset,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [savedSettings, setSavedSettings] = useState<{
    [key: string]: GraphSettings;
  }>({});

  // 保存された設定を読み込む
  const loadSavedSettings = () => {
    const settings = localStorage.getItem("graphSettings");
    if (settings) {
      setSavedSettings(JSON.parse(settings));
    }
  };

  // 設定を保存する
  const saveSettings = () => {
    const name = prompt("設定の名前を入力してください:");
    if (!name) return;

    const currentSettings = { ...savedSettings, [name]: settings };
    localStorage.setItem("graphSettings", JSON.stringify(currentSettings));
    setSavedSettings(currentSettings);
    message.success("設定を保存しました");
  };

  // 保存された設定を読み込む
  const loadSettings = (name: string) => {
    const savedSetting = savedSettings[name];
    if (savedSetting) {
      onSettingsChange(savedSetting);
      message.success("設定を読み込みました");
    }
  };

  // 保存された設定を削除する
  const deleteSettings = (name: string) => {
    const newSettings = { ...savedSettings };
    delete newSettings[name];
    localStorage.setItem("graphSettings", JSON.stringify(newSettings));
    setSavedSettings(newSettings);
    message.success("設定を削除しました");
  };

  // モーダルを開く
  const showModal = () => {
    loadSavedSettings();
    setIsModalVisible(true);
  };

  return (
    <Card className="card fade-in">
      <h3 className="text-lg font-semibold mb-4">設定</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">X軸</label>
          <Select
            value={settings.xAxisFeature}
            onChange={(value) => onSettingsChange({ xAxisFeature: value })}
            className="w-full"
          >
            {availableFeatures.map((feature) => (
              <Option key={feature} value={feature}>
                {feature}
              </Option>
            ))}
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Y軸</label>
          <Select
            mode="multiple"
            value={settings.yAxisFeatures}
            onChange={(value) => onSettingsChange({ yAxisFeatures: value })}
            className="w-full"
          >
            {availableFeatures.map((feature) => (
              <Option key={feature} value={feature}>
                {feature}
              </Option>
            ))}
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">グラフタイプ</label>
          <Select
            value={settings.chartType}
            onChange={(value) => onSettingsChange({ chartType: value })}
            className="w-full"
          >
            <Option value="bar">棒グラフ</Option>
            <Option value="line">折れ線グラフ</Option>
            <Option value="pie">円グラフ</Option>
            <Option value="scatter">散布図</Option>
            <Option value="area">累積グラフ</Option>
            <Option value="boxplot">箱ひげ図</Option>
          </Select>
        </div>

        <Space className="w-full justify-between">
          <Button type="primary" icon={<SaveOutlined />} onClick={saveSettings}>
            設定を保存
          </Button>
          <Button icon={<FolderOpenOutlined />} onClick={showModal}>
            設定を読み込む
          </Button>
          <Button danger onClick={onReset}>
            リセット
          </Button>
        </Space>
      </div>

      <Modal
        title="保存された設定"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <List
          dataSource={Object.keys(savedSettings)}
          renderItem={(name) => (
            <List.Item
              actions={[
                <Button
                  key="load"
                  type="link"
                  onClick={() => {
                    loadSettings(name);
                    setIsModalVisible(false);
                  }}
                >
                  読み込む
                </Button>,
                <Button
                  key="delete"
                  type="link"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => deleteSettings(name)}
                >
                  削除
                </Button>,
              ]}
            >
              <List.Item.Meta title={name} />
            </List.Item>
          )}
        />
      </Modal>
    </Card>
  );
};

export default SettingsPanel;
