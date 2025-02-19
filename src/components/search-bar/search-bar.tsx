"use client";

import React, { useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "~/components/ui/command";

const SearchBar = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-1/4">
      <Command>
        <CommandInput
          // value={searchKeyword}
          placeholder="Type a command or search..."
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
        />

        {open && (
          <CommandList className="mt-1 bg-sidebar-accent">
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              <CommandItem>Calendar</CommandItem>
              <CommandItem>Search Emoji</CommandItem>
              <CommandItem>Calculator</CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Settings">
              <CommandItem>Profile</CommandItem>
              <CommandItem>Billing</CommandItem>
              <CommandItem>Settings</CommandItem>
            </CommandGroup>
          </CommandList>
        )}
      </Command>
    </div>
  );
};

export default SearchBar;
