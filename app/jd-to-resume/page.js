"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  FileSearch,
  LayoutPanelLeft,
  Sparkles,
  TextCursorInput,
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
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const resumePreview = {
  title: "Senior Frontend Engineer",
  company: "Atlas Labs",
  score: 87,
  summary:
    "Strong React, design system, and testing experience. Good alignment for product engineering roles.",
  highlights: [
    "React, Next.js, TypeScript",
    "Design systems and component libraries",
    "Playwright, Jest, and quality automation",
    "Cross-functional collaboration with product and design",
  ],
  gaps: ["Kubernetes", "GraphQL", "Platform engineering"],
};

export default function JDToResumePage() {
  const [jd, setJd] = useState(
    "We are looking for a Senior Frontend Engineer with strong React, TypeScript, and design system experience. The role requires collaboration with product and design teams, ownership of UI quality, and knowledge of testing tools like Jest and Playwright.",
  );

  const analysis = useMemo(() => {
    const wordCount = jd.trim().split(/\s+/).filter(Boolean).length;
    const matchBoost = Math.min(10, Math.floor(wordCount / 25));
    return {
      wordCount,
      score: Math.min(100, resumePreview.score + matchBoost),
      keywords: [
        "React",
        "TypeScript",
        "Testing",
        "Design systems",
        "Collaboration",
      ],
    };
  }, [jd]);

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
                  <BreadcrumbPage>JD to Resume</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 xl:flex-row">
          <Card className="min-h-[620px] flex-1">
            <CardHeader className="space-y-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <TextCursorInput className="h-4 w-4" />
                Paste JD
              </CardTitle>
              <CardDescription>
                Enter the job description to compare it against the resume
                preview.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={jd}
                onChange={(event) => setJd(event.target.value)}
                placeholder="Paste the job description here..."
                className="min-h-[360px] resize-none border-border bg-background text-sm"
              />

              <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-xl border border-border bg-secondary/50 p-3">
                  <div className="text-xs text-muted-foreground">JD words</div>
                  <div className="mt-1 text-lg font-semibold">
                    {analysis.wordCount}
                  </div>
                </div>
                <div className="rounded-xl border border-border bg-secondary/50 p-3">
                  <div className="text-xs text-muted-foreground">
                    Preview match
                  </div>
                  <div className="mt-1 text-lg font-semibold">
                    {analysis.score}%
                  </div>
                </div>
                <div className="rounded-xl border border-border bg-secondary/50 p-3">
                  <div className="text-xs text-muted-foreground">Keywords</div>
                  <div className="mt-1 text-sm font-medium">5 tracked</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Analyze
                </Button>
                <Button variant="outline">
                  <FileSearch className="mr-2 h-4 w-4" />
                  Generate resume
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="min-h-[620px] flex-1">
            <CardHeader className="space-y-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <LayoutPanelLeft className="h-4 w-4" />
                Resume preview
              </CardTitle>
              <CardDescription>
                Read-only preview panel showing how the current resume aligns
                with the JD.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-2xl border border-border bg-secondary/40 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-lg font-semibold">
                      {resumePreview.title}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {resumePreview.company}
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {analysis.score}% match
                  </Badge>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  {resumePreview.summary}
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-border bg-background p-4">
                  <div className="text-sm font-medium">Strengths</div>
                  <div className="mt-3 space-y-2">
                    {resumePreview.highlights.map((item) => (
                      <div
                        key={item}
                        className="rounded-xl border border-border bg-secondary/40 px-3 py-2 text-sm"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-border bg-background p-4">
                  <div className="text-sm font-medium">Missing skills</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {resumePreview.gaps.map((gap) => (
                      <Badge key={gap} variant="outline" className="text-xs">
                        {gap}
                      </Badge>
                    ))}
                  </div>
                  <div className="mt-4 border-t border-border pt-4">
                    <div className="text-sm font-medium">JD keywords</div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {analysis.keywords.map((keyword) => (
                        <Badge key={keyword} className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-secondary/30 p-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <ArrowRight className="h-4 w-4" />
                  Suggested next step
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Use the JD details to refine the preview resume and improve
                  the match score.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
