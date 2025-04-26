"use client";

import {
  useUser,
  SignedIn,
  UserButton,
  SignedOut,
  SignInButton,
} from "@clerk/nextjs";
import { Button } from "./ui/button";
import Image from "next/image";
import { ChevronsLeftIcon, MenuIcon } from "lucide-react";
import { useSidebar } from "./ui/sidebar";

const Header = () => {
  //const { user } = useUser();
  const { toggleSidebar, open, isMobile } = useSidebar();

  //AI moderation
  //const isBanned = user?.publicMetadata["IS_BANNED"] as boolean;

  return (
    <header className="flex items-center justify-between p-4 border-b border-gray-200">
      {/* Left Side */}
      <div className="h-10 flex items-center">
        {open && !isMobile ? (
          <ChevronsLeftIcon className="w-6 h-6" onClick={toggleSidebar} />
        ) : (
          <div className="flex items-center gap-2">
            <MenuIcon className="w-6 h-6" onClick={toggleSidebar} />
            {/* <Image 
        src='/logo.png'
        alt='logo'
        width={150}
        height={150}
        className="md:block hidden"
        />
        <Image 
        src='/logo.png'
        alt='logo'
        width={40}
        height={40}
        className="block md:hidden"
        /> */}
          </div>
        )}
      </div>

      {/* Right side */}
      <div>
        <SignedIn>
          <UserButton />
        </SignedIn>

        <SignedOut>
          <Button asChild variant="outline">
            <SignInButton mode="modal" />
          </Button>
        </SignedOut>
      </div>
    </header>
  );
};

export default Header;
