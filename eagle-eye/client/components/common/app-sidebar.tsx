"use client";

import * as React from "react";
import {
  Home,
  Workflow,
  // AudioWaveform,
  // BookOpen,
  // Bot,
  // Command,
  // Frame,
  // GalleryVerticalEnd,
  // Map,
  // PieChart,
  Settings2,
} from "lucide-react";

import { NavMain } from "@/components/common/nav-main";
//import { NavProjects } from "@/components/common/nav-projects"
import { NavUser } from "@/components/common/nav-user";
//import { TeamSwitcher } from "@/components/common/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  //SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { useGetUserProfile } from "@/hooks/useUser";
import Logo from "./Logo";
import { generalData } from "@/data/general";

const data = {
  // teams: [
  //   {
  //     name: "Acme Inc",
  //     logo: GalleryVerticalEnd,
  //     plan: "Enterprise",
  //   },
  //   {
  //     name: "Acme Corp.",
  //     logo: AudioWaveform,
  //     plan: "Startup",
  //   },
  //   {
  //     name: "Evil Corp.",
  //     logo: Command,
  //     plan: "Free",
  //   },
  // ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Flows",
      url: "#",
      icon: Workflow,
      items: [
        {
          title: "Recruter Finder",
          url: "/dashboard/flows/recruter-finder",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Profile",
          url: "/dashboard/settings/profile",
        },
        {
          title: "Cookies",
          url: "/dashboard/settings/cookies",
        },
      ],
    },
  ],
  // projects: [
  //   {
  //     name: "Design Engineering",
  //     url: "#",
  //     icon: Frame,
  //   },
  //   {
  //     name: "Sales & Marketing",
  //     url: "#",
  //     icon: PieChart,
  //   },
  //   {
  //     name: "Travel",
  //     url: "#",
  //     icon: Map,
  //   },
  // ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: userProfile } = useGetUserProfile();
  const { state } = useSidebar();

  const user = {
    id: userProfile?.data?.id || "",
    email: userProfile?.data?.email || "",
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <div
        className={`transition-all duration-300 ease-in-out ${
          state === "expanded"
            ? "opacity-100 max-h-20"
            : "opacity-0 max-h-0 overflow-hidden"
        }`}
      >
        <SidebarHeader className="flex flex-row m-2 mb-0 px-3 items-center justify-between gap-3 border rounded-md">
          <div className="flex flex-col gap-1">
            <h1 className="text-sm font-bold uppercase">{generalData.title}</h1>
            <p className="text-xs text-muted-foreground">
              {generalData.version}
            </p>
          </div>
          <Logo className="size-8" />
          {/* <TeamSwitcher teams={data.teams} /> */}
        </SidebarHeader>
      </div>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
