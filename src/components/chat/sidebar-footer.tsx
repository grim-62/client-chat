"use client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Calendar,
  ChevronUp,
  User2,
  Inbox,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import { SidebarMenuItem } from "../ui/sidebar";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";
import { AuthService } from "@/services/auth.service";
import { toast } from "sonner";
import { selectUserRefreshtoken } from "@/store/slice/user.slice";
import { ThemeToggleButton } from "../theme/theme-toggle-button";

const FooterSidebar = () => {
  const dispatch = useAppDispatch();
  const token = useAppSelector(selectUserRefreshtoken)
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      const res = await AuthService.logout({token});
      if (res.success) {
        // dispatch(clearAuth());
        sessionStorage.removeItem("access_token");
        document.cookie =
          "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        router.push("/login");
      }
    } catch (error) {
      console.log("Error from verify otp", error);
      toast.warning("Something went wrong");
    }
  };

  const items = [
    { title: "Account", url: "#", icon: User2 },
    { title: "Inbox", url: "#", icon: Inbox },
    { title: "Settings", url: "#", icon: Settings },
  ];

  return (
    <DropdownMenu >
      <DropdownMenuTrigger asChild>
        <SidebarMenuItem className="flex mb-3 mx-4 gap-2 items-center">
          <User />
          {"data?.email"}
          <ChevronUp className="ml-auto" />
        </SidebarMenuItem>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="top"
        className="w-[--radix-popper-anchor-width]"
      >
        {/* <DropdownMenuItem>
          <ThemeToggleButton/>
        </DropdownMenuItem> */}

        {items.map((item) => (
          <DropdownMenuItem key={item.title}>
            <a href={item.url} className="flex gap-2 items-center">
              <item.icon />
              {item.title}
            </a>
          </DropdownMenuItem>
        ))}

        {/* 🔹 Sign out button */}
        <DropdownMenuItem
          onClick={() => handleSignOut()}
          className="cursor-pointer"
        >
          <LogOut className="mr-2" /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FooterSidebar;
