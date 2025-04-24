"use client";

import { useSettingsTab } from "~/components/providers/settings-tab-provider";
import { Button } from "~/components/ui/button";

const SettingsTabs = () => {
  const { activeTab, setActiveTab } = useSettingsTab();

  const tabs = [
    { value: "account", label: "Account" },
    { value: "notifications", label: "Notifications" },
    { value: "billing", label: "Billing" },
  ];

  return (
    <div className="grid w-full max-w-lg grid-cols-3 bg-transparent p-0">
      {tabs.map((tab) => (
        <Button
          key={tab.value}
          value={tab.value}
          size="lg"
          onClick={() => setActiveTab(tab.value as any)}
          className={`rounded-none border-b-2 px-4 hover:border-b-2 hover:border-xw-primary ${
            activeTab === tab.value
              ? "border-xw-primary bg-gradient-to-t from-xw-primary-foreground to-transparent text-white hover:bg-transparent"
              : "bg-transparent bg-gradient-to-t text-white hover:bg-xw-secondary hover:bg-gradient-to-t"
          }`}
        >
          {tab.label}
        </Button>
      ))}
    </div>
  );
};

export default SettingsTabs;
