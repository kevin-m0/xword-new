import React from "react";
import SettingsTabs from "./SettingsTabs";
import SettingsRenderTabs from "./SettingsRenderTabs";
import SettingsHeader from "./SettingsHeader";
import SettingsTabProvider from "~/components/providers/settings-tab-provider";

const SettingComponent = () => {
  return (
    <SettingsTabProvider>
      <div className="flex flex-col gap-5">
        <div className="flex flex-1 flex-col gap-10 p-5 pb-20">
          <SettingsHeader />
          <SettingsTabs />
          <SettingsRenderTabs />
        </div>
      </div>
    </SettingsTabProvider>
  );
};

export default SettingComponent;
