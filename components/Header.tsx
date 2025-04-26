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
import { MenuIcon } from "lucide-react";

const Header = () => {
  const { user } = useUser();
  return (
    <header className="flex items-center justify-between p-4 border-b border-gray-200">
      {/* Left Side */}
      <div className="flex items-center gap-2">
        <MenuIcon className="w-6 h-6" />
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

      {/* Right side */}
      <div>
        <SignedIn>
          <UserButton />
        </SignedIn>

        <SignedOut>
          <Button asChild variant='outline' >
            <SignInButton mode="modal" />
          </Button>
        </SignedOut>
      </div>
    </header>
  );
};

export default Header;
