import { Button } from "~/components/ui/button";
import {
  XWDropdown,
  XWDropdownContent,
  XWDropdownItem,
  XWDropdownTrigger,
} from "~/components/reusable/xw-dropdown";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/reusable/XWSelect";
import XWSecondaryButton from "~/components/reusable/XWSecondaryButton";
import Image from "next/image";
import SettingsChangeEmail from "../SettingsChangeEmail";
import SettingsChangePassword from "../SettingsChangePassword";
import SettingsLogoutModel from "../SettingsLogoutModel";
import SettingsDeactivateAccount from "../SettingsDeactivateAccount";
import { Input } from "~/components/ui/input";

const AccountTab = () => {
  return (
    <div className="flex w-full max-w-3xl flex-col gap-8">
      {/* Profile Section */}
      <div className="flex flex-col gap-8">
        <h2 className="text-xl font-semibold">Profile</h2>

        {/* Profile Picture Section */}
        <div className="flex flex-col gap-4">
          <label className="text-sm font-medium">Profile Picture</label>
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-md bg-blue-300 text-2xl text-white">
              A
            </div>
            <XWDropdown>
              <XWDropdownTrigger asChild>
                <div>
                  <XWSecondaryButton>Update Profile Picture</XWSecondaryButton>
                </div>
              </XWDropdownTrigger>
              <XWDropdownContent>
                <XWDropdownItem className="flex items-center gap-2">
                  <Image
                    src={"/icons/folder.svg"}
                    alt="Folder"
                    width={16}
                    height={16}
                  />
                  Select from Assets
                </XWDropdownItem>
                <XWDropdownItem className="flex items-center gap-2">
                  <Image
                    src={"/icons/file-add.svg"}
                    alt="Upload"
                    width={16}
                    height={16}
                  />
                  Upload from PC
                </XWDropdownItem>
              </XWDropdownContent>
            </XWDropdown>
          </div>
        </div>

        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">First Name</label>
            <Input placeholder="First Name" defaultValue="Kevin" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Last Name</label>
            <Input placeholder="Last Name" defaultValue="Roy" />
          </div>
        </div>

        {/* Email Section */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Email</label>
          <div className="flex items-center gap-4">
            <Input
              placeholder="Email"
              defaultValue="usernumer2@gmail.com"
              className="flex-1"
            />
            <div>
              <SettingsChangeEmail />
            </div>
          </div>
        </div>

        {/* Timezone Section */}
        <div className="flex max-w-md flex-col gap-2">
          <label className="text-sm font-medium">Select timezone</label>
          <Select defaultValue="IST">
            <SelectTrigger>
              <SelectValue placeholder="Select timezone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="IST">
                (GMT+05:30) India Standard Time - Kolkata
              </SelectItem>
              <SelectItem value="PST">
                (GMT-08:00) Pacific Standard Time
              </SelectItem>
              <SelectItem value="EST">
                (GMT-05:00) Eastern Standard Time
              </SelectItem>
              <SelectItem value="UTC">
                (GMT+00:00) Coordinated Universal Time
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Password Section */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Password</label>
          <div>
            <SettingsChangePassword />
          </div>
        </div>

        {/* Save Changes Button */}
        <div>
          <Button variant="default" size="sm">
            Save Changes
          </Button>
        </div>
      </div>

      {/* Log out section */}
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Log out from all sessions</h2>
        <div>
          <SettingsLogoutModel />
        </div>
      </div>

      {/* Danger zone section */}
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Danger zone</h2>
        {/* Add danger zone content here */}

        <div>
          <p className="mb-2 text-sm">Deactivation Your XWord Account</p>

          <SettingsDeactivateAccount />
        </div>
      </div>
    </div>
  );
};

export default AccountTab;
