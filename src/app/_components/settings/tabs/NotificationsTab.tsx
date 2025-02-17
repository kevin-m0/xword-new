import { Switch } from "~/components/ui/switch";
import { Label } from "~/components/ui/label";
import { Checkbox } from "~/components/ui/checkbox";

const NotificationsTab = () => {
  return (
    <div className="flex w-full max-w-2xl flex-col space-y-12">
      {/* Browser Notifications Section */}
      <div className="flex flex-col space-y-4">
        <h2 className="text-2xl font-semibold">Browser notifications</h2>
        <div className="flex items-start space-x-3">
          <Switch id="browser-notify" />
          <div className="flex flex-col space-y-1">
            <Label htmlFor="browser-notify" className="text-base">
              Enable notifications for completed generations
            </Label>
            <p className="text-sm text-xw-muted">
              Do you want to receive a desktop notification when a generation is
              completed.
            </p>
          </div>
        </div>
      </div>

      {/* Email Notifications Section */}
      <div className="flex flex-col space-y-4">
        <h2 className="text-2xl font-semibold">Email Notifications</h2>
        <p className="text-sm text-xw-muted">Choose to subscribe or opt-out:</p>
        <div className="flex flex-col space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox id="general-updates" />
            <Label htmlFor="general-updates">General Updates</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="marketing" />
            <Label htmlFor="marketing">Marketing</Label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsTab;
