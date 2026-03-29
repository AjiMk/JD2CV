"use client";

import Link from "next/link";
import { Bell, ChevronDown, Menu, Search, SunMedium, Moon } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navItems = ["Overview", "Applications", "Reports", "Settings"];
const mobileLinks = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Profile", href: "/profile" },
  { label: "Resume Builder", href: "/resume-builder" },
  { label: "Job Tracker", href: "/job-tracker" },
];

export default function DashboardNavbar({
  user,
  onLogout,
  onToggleTheme,
  showSearch = true,
}) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const initials = (user?.name || user?.email || "U")
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <header className="flex items-center justify-between border-b border-border bg-card px-6 py-3">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-foreground text-background">
            <span className="text-sm font-bold">JD</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">JD2CV</p>
            <p className="text-xs text-muted-foreground">Dashboard</p>
          </div>
        </div>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item, index) => (
            <Button
              key={item}
              variant="ghost"
              size="sm"
              className={
                index === 0
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }
              onClick={() =>
                router.push(index === 0 ? "/dashboard" : "/dashboard")
              }
            >
              {item}
            </Button>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <div className="md:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open navigation">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <SheetHeader className="text-left">
                <SheetTitle>Navigation</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-2">
                {mobileLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {showSearch ? (
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search..." className="w-64 pl-9" />
          </div>
        ) : null}

        <Button variant="ghost" size="icon" onClick={onToggleTheme}>
          <SunMedium className="hidden h-4 w-4 dark:block" />
          <Moon className="h-4 w-4 dark:hidden" />
        </Button>

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2">
              <Avatar className="h-7 w-7">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.push("/profile")}>
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/resume-builder")}>
              Resume Builder
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/job-tracker")}>
              Job Tracker
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onLogout}>Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
