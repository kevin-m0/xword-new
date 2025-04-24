"use client";

import { useSettingsTab } from "~/components/providers/settings-tab-provider";
import AccountTab from "./tabs/AccountTab";
import BillingTab from "./tabs/BillingTab";
import NotificationsTab from "./tabs/NotificationsTab";

const SettingsRenderTabs = () => {
  const { activeTab } = useSettingsTab();

  const renderContent = () => {
    switch (activeTab) {
      case "account":
        return <AccountTab />;
      case "billing":
        return <BillingTab />;
      case "notifications":
        return <NotificationsTab />;
      default:
        return <AccountTab />;
    }
  };

  return <div className="w-full">{renderContent()}</div>;
};

export default SettingsRenderTabs;
