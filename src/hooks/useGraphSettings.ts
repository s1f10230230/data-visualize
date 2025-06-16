import { useState, useCallback } from "react";
import { message } from "antd";
import { GraphSettings, SavedSettings } from "../types";

const STORAGE_KEY = "graphSettings";

export const useGraphSettings = () => {
  const [settings, setSettings] = useState<GraphSettings>({
    chartType: "bar",
    xAxisFeature: "",
    yAxisFeatures: [],
    xAxisLabel: "X軸ラベル",
    yAxisLabel: "Y軸ラベル",
    legendPosition: "right",
    colorPalette: ["#5470c6", "#91cc75", "#fac858", "#ee6666", "#73c0de"],
    zoom: 100,
    filterFeature: "",
    filterOperator: ">",
    filterValue: null,
    sortFeature: "",
    sortOrder: "asc",
  });

  const saveSettings = useCallback(() => {
    const savedSettings = localStorage.getItem(STORAGE_KEY);
    const settingsList = savedSettings ? JSON.parse(savedSettings) : [];
    const newSetting: SavedSettings = {
      ...settings,
      timestamp: new Date().toISOString(),
      name: `設定 ${settingsList.length + 1}`,
    };

    settingsList.push(newSetting);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settingsList));
    message.success("設定を保存しました");
  }, [settings]);

  const loadSettings = useCallback((savedSettings: GraphSettings) => {
    setSettings(savedSettings);
    message.success("設定を復元しました");
  }, []);

  const getSavedSettings = useCallback((): SavedSettings[] => {
    const savedSettings = localStorage.getItem(STORAGE_KEY);
    return savedSettings ? JSON.parse(savedSettings) : [];
  }, []);

  const deleteSettings = useCallback(
    (index: number) => {
      const settingsList = getSavedSettings();
      settingsList.splice(index, 1);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settingsList));
      message.success("設定を削除しました");
    },
    [getSavedSettings]
  );

  const updateSettings = useCallback((newSettings: Partial<GraphSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  return {
    settings,
    updateSettings,
    saveSettings,
    loadSettings,
    getSavedSettings,
    deleteSettings,
  };
};
