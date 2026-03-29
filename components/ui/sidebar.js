"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Menu, PanelLeft } from "lucide-react";

import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const SidebarContext = createContext(null);

function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);

    update();
    media.addEventListener?.("change", update);
    media.addListener?.(update);

    return () => {
      media.removeEventListener?.("change", update);
      media.removeListener?.(update);
    };
  }, [query]);

  return matches;
}

export function SidebarProvider({ children, defaultOpen = true }) {
  const [desktopOpen, setDesktopOpen] = useState(defaultOpen);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  useEffect(() => {
    if (isDesktop) setMobileOpen(false);
  }, [isDesktop]);

  const value = useMemo(
    () => ({
      desktopOpen,
      setDesktopOpen,
      mobileOpen,
      setMobileOpen,
      isDesktop,
    }),
    [desktopOpen, mobileOpen, isDesktop],
  );

  return (
    <SidebarContext.Provider value={value}>
      <div
        className={cn(
          "group/sidebar-wrapper min-h-screen w-full bg-background text-foreground transition-[padding] duration-300 ease-in-out",
          desktopOpen ? "lg:pl-64" : "lg:pl-16",
        )}
        data-sidebar-collapsed={!desktopOpen}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  );
}

export function SidebarInset({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "flex min-h-screen flex-1 flex-col transition-all",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function SidebarTrigger({ className, ...props }) {
  const { desktopOpen, setDesktopOpen, mobileOpen, setMobileOpen, isDesktop } =
    useSidebar();

  return (
    <Button
      variant="outline"
      size="icon"
      className={cn("shrink-0", className)}
      onClick={() =>
        isDesktop
          ? setDesktopOpen((value) => !value)
          : setMobileOpen((value) => !value)
      }
      {...props}
    >
      {isDesktop ? (
        desktopOpen ? (
          <PanelLeft className="h-4 w-4" />
        ) : (
          <Menu className="h-4 w-4" />
        )
      ) : mobileOpen ? (
        <PanelLeft className="h-4 w-4" />
      ) : (
        <Menu className="h-4 w-4" />
      )}
    </Button>
  );
}

export function Sidebar({ className, children, ...props }) {
  const { desktopOpen, mobileOpen, setMobileOpen, isDesktop } = useSidebar();

  return (
    <>
      {!isDesktop && mobileOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border bg-card transition-[transform,width] duration-300 ease-in-out will-change-transform",
          isDesktop
            ? "lg:translate-x-0 lg:flex"
            : mobileOpen
              ? "translate-x-0"
              : "-translate-x-full",
          desktopOpen ? "lg:w-64" : "lg:w-16",
          className,
        )}
        {...props}
      >
        {children}
      </aside>
    </>
  );
}

export function SidebarHeader({ className, ...props }) {
  return (
    <div
      className={cn(
        "border-b border-border p-4 transition-all duration-200",
        className,
      )}
      {...props}
    />
  );
}

export function SidebarContent({ className, ...props }) {
  return (
    <div
      className={cn(
        "flex-1 overflow-auto p-4 transition-all duration-200",
        className,
      )}
      {...props}
    />
  );
}

export function SidebarFooter({ className, ...props }) {
  return (
    <div
      className={cn(
        "border-t border-border p-4 transition-all duration-200",
        className,
      )}
      {...props}
    />
  );
}

export function SidebarGroup({ className, ...props }) {
  return <div className={cn("mb-6", className)} {...props} />;
}

export function SidebarGroupLabel({ className, ...props }) {
  return (
    <div
      className={cn(
        "mb-2 px-2 text-xs uppercase tracking-wider text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

export function SidebarMenu({ className, ...props }) {
  return <nav className={cn("space-y-1", className)} {...props} />;
}

export function SidebarMenuItem({ className, ...props }) {
  return <div className={cn("", className)} {...props} />;
}

export function SidebarMenuButton({ className, active, ...props }) {
  return (
    <button
      className={cn(
        "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
        active
          ? "bg-secondary text-foreground"
          : "text-muted-foreground hover:bg-secondary hover:text-foreground",
        className,
      )}
      {...props}
    />
  );
}

function useSidebar() {
  const context = useContext(SidebarContext);

  if (!context) {
    throw new Error("useSidebar must be used within SidebarProvider");
  }

  return context;
}
