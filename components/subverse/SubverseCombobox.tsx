"use client"

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { cn } from "@/lib/utils";

type Subverse = {
  _id: string;
  title: string | null;
  slug: string | null;
};

interface SubverseComboboxProps {
  subverses: Subverse[];
  defaultValue?: string;
}

function SubverseCombobox({
  subverses,
  defaultValue = "",
}: SubverseComboboxProps) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultValue);

  //Handle selection of a subverse
  const handleSelect = (currentValue: string) => {
    setValue(currentValue);
    setOpen(false);

    //Update the URL query parameter
    if (currentValue) {
      router.push(`/create-post?subverse=${currentValue}`);
    } else {
      router.push(`/create-post`);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? subverses.find((subverse) => subverse.title === value)?.title ||
              "Select a community"
            : "Select a community"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command>
          <CommandInput placeholder="Search Community ..." />
          <CommandList>
            <CommandEmpty>No Subverse found</CommandEmpty>
            <CommandGroup>
              {subverses.map((subverse) => (
                <CommandItem
                  key={subverse._id}
                  value={subverse.title ?? ""}
                  onSelect={handleSelect}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === subverse.title ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {subverse.title}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default SubverseCombobox;
