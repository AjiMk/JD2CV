"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  ArrowRight,
  Building2,
  Map,
  Network,
  Search,
  Sparkles,
  UserCircle2,
} from "lucide-react";

import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import Button from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const resumeMapData = [
  {
    id: "RS-1024",
    name: "Senior Frontend Engineer",
    version: "v4.2",
    selected: true,
    summary: "Optimized for product engineering and design systems roles.",
    organizations: [
      { name: "Stripe", score: 96, used: true, label: "Core match" },
      { name: "Airbnb", score: 89, used: true, label: "Strong fit" },
      { name: "Notion", score: 84, used: false, label: "Partial fit" },
      { name: "Linear", score: 91, used: true, label: "High fit" },
      { name: "Slack", score: 78, used: false, label: "Needs tuning" },
    ],
  },
  {
    id: "RS-0881",
    name: "Product Designer",
    version: "v3.8",
    selected: false,
    summary: "Design-forward resume with strong collaboration language.",
    organizations: [
      { name: "Figma", score: 92, used: true, label: "Core match" },
      { name: "Webflow", score: 87, used: true, label: "Strong fit" },
      { name: "Canva", score: 81, used: false, label: "Partial fit" },
    ],
  },
];

export default function ResumeMapPage() {
  const [selectedResumeId, setSelectedResumeId] = useState("RS-1024");
  const selectedResume = useMemo(
    () =>
      resumeMapData.find((resume) => resume.id === selectedResumeId) ||
      resumeMapData[0],
    [selectedResumeId],
  );

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>Resume map</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="grid gap-4 xl:grid-cols-[280px_minmax(0,1fr)]">
            <Card>
              <CardHeader className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-base">Selected resume</CardTitle>
                  <Badge variant="outline" className="text-xs">
                    Map view
                  </Badge>
                </div>
                <CardDescription>
                  Choose a resume to inspect its organization usage graph.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {resumeMapData.map((resume) => {
                  const active = resume.id === selectedResume.id;
                  return (
                    <button
                      key={resume.id}
                      type="button"
                      onClick={() => setSelectedResumeId(resume.id)}
                      className={`w-full rounded-xl border p-3 text-left transition-colors ${
                        active
                          ? "border-primary bg-secondary"
                          : "border-border bg-background hover:bg-secondary/60"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-sm font-semibold">
                            {resume.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {resume.id} · {resume.version}
                          </div>
                        </div>
                        <Badge
                          variant={active ? "default" : "outline"}
                          className="text-[11px]"
                        >
                          {resume.selected ? "Selected" : "Available"}
                        </Badge>
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {resume.summary}
                      </p>
                    </button>
                  );
                })}
              </CardContent>
            </Card>

            <Card className="min-h-[540px]">
              <CardHeader className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Map className="h-4 w-4" />
                      Resume-to-organization map
                    </CardTitle>
                    <CardDescription>
                      Visual relationship view between the selected resume and
                      the organizations it has been used for.
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Search className="mr-2 h-4 w-4" />
                      Find org
                    </Button>
                    <Button size="sm">
                      <Sparkles className="mr-2 h-4 w-4" />
                      Optimize resume
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
                <div className="relative overflow-hidden rounded-2xl border border-border bg-secondary/40 p-4">
                  <div className="mb-4 flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <UserCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">
                        {selectedResume.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {selectedResume.id} · {selectedResume.version}
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-[1fr_1fr]">
                    <div className="rounded-2xl border border-dashed border-border bg-background p-4">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Network className="h-4 w-4 text-muted-foreground" />
                        Resume node
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">
                        Central profile connected to the target organizations
                        below.
                      </p>
                    </div>

                    <div className="space-y-3">
                      {selectedResume.organizations.map((org, index) => (
                        <div key={org.name} className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-background text-muted-foreground">
                            <Building2 className="h-4 w-4" />
                          </div>
                          <div className="min-w-0 flex-1 rounded-2xl border border-border bg-background p-3">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <div className="text-sm font-medium">
                                  {org.name}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {org.label}
                                </div>
                              </div>
                              <Badge variant="outline" className="text-[11px]">
                                {org.score}%
                              </Badge>
                            </div>
                          </div>
                          {index < selectedResume.organizations.length - 1 ? (
                            <ArrowRight className="hidden h-4 w-4 text-muted-foreground md:block" />
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">
                        Relationship summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Organizations mapped
                        </span>
                        <span className="font-medium">
                          {selectedResume.organizations.length}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Used in applications
                        </span>
                        <span className="font-medium">
                          {
                            selectedResume.organizations.filter(
                              (org) => org.used,
                            ).length
                          }
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Avg. organization fit
                        </span>
                        <span className="font-medium">
                          {Math.round(
                            selectedResume.organizations.reduce(
                              (sum, org) => sum + org.score,
                              0,
                            ) / selectedResume.organizations.length,
                          )}
                          %
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">
                        Used organizations
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {selectedResume.organizations.map((org) => (
                        <div
                          key={org.name}
                          className="flex items-center justify-between rounded-xl border border-border bg-background px-3 py-2 text-sm"
                        >
                          <div className="flex items-center gap-2">
                            <Activity className="h-4 w-4 text-muted-foreground" />
                            <span>{org.name}</span>
                          </div>
                          <Badge
                            variant={org.used ? "default" : "outline"}
                            className="text-[11px]"
                          >
                            {org.used ? "Used" : "Planned"}
                          </Badge>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
