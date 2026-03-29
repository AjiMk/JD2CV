"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Clock3,
  Download,
  Folder,
  MoreHorizontal,
  MoveRight,
  Plus,
  Search,
  Share2,
  Star,
  FileText,
  Table2,
  List,
  LayoutGrid,
  Trash2,
} from "lucide-react";

import { AppSidebar } from "@/components/app-sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Button from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const initialFolders = [
  { name: "Applications", count: 12 },
  { name: "Tech Roles", count: 8 },
  { name: "Design Roles", count: 4 },
  { name: "Archived", count: 15 },
];

const initialFiles = [
  {
    name: "John Doe - Frontend Resume.pdf",
    folder: "Tech Roles",
    updatedAt: "Today",
    size: "214 KB",
    starred: true,
    type: "PDF",
    pages: 2,
  },
  {
    name: "John Doe - Full Stack Resume.pdf",
    folder: "Applications",
    updatedAt: "Yesterday",
    size: "198 KB",
    starred: false,
    type: "PDF",
    pages: 2,
  },
  {
    name: "John Doe - Product Resume.pdf",
    folder: "Design Roles",
    updatedAt: "Mar 24",
    size: "176 KB",
    starred: false,
    type: "PDF",
    pages: 1,
  },
  {
    name: "John Doe - ATS Version.pdf",
    folder: "Applications",
    updatedAt: "Mar 20",
    size: "221 KB",
    starred: true,
    type: "PDF",
    pages: 2,
  },
  {
    name: "John Doe - Archived v1.pdf",
    folder: "Archived",
    updatedAt: "Mar 12",
    size: "182 KB",
    starred: false,
    type: "PDF",
    pages: 2,
  },
];

export default function ResumePage() {
  const router = useRouter();
  const [view, setView] = useState("list");
  const [folders, setFolders] = useState(initialFolders);
  const [files, setFiles] = useState(initialFiles);
  const [newFolderName, setNewFolderName] = useState("");
  const [search, setSearch] = useState("");

  const filteredFiles = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return files;
    return files.filter((file) =>
      [file.name, file.folder, file.updatedAt, file.size, file.type]
        .join(" ")
        .toLowerCase()
        .includes(term),
    );
  }, [files, search]);

  const handleCreateFolder = () => {
    const name = newFolderName.trim();
    if (!name) return;
    setFolders((current) =>
      current.some((folder) => folder.name === name)
        ? current
        : [...current, { name, count: 0 }],
    );
    setNewFolderName("");
  };

  const handleDeleteFile = (name) => {
    setFiles((current) => current.filter((file) => file.name !== name));
  };

  const handleMoveFile = (name) => {
    const nextFolder = window.prompt("Move to folder:");
    if (!nextFolder) return;
    setFiles((current) =>
      current.map((file) =>
        file.name === name ? { ...file, folder: nextFolder } : file,
      ),
    );
    setFolders((current) =>
      current.some((folder) => folder.name === nextFolder)
        ? current
        : [...current, { name: nextFolder, count: 0 }],
    );
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex w-full items-center justify-between gap-2 px-3">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <div className="text-sm font-medium">All resumes</div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={view === "grid" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setView("grid")}
                aria-label="Grid view"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={view === "list" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setView("list")}
                aria-label="List view"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={view === "table" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setView("table")}
                aria-label="Table view"
              >
                <Table2 className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleCreateFolder}
                aria-label="Create folder"
              >
                <Folder className="h-4 w-4" />
              </Button>
              <Button variant="default" size="icon" aria-label="Upload resume">
                <Plus className="h-4 w-4" />
              </Button>
              <Avatar className="h-8 w-8">
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        <main className="flex flex-1 flex-col gap-6 p-4">
          <Card>
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <CardTitle>Resume Files</CardTitle>
                <div className="relative w-full max-w-md">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search files or folders..."
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Input
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="New folder name"
                  className="max-w-sm"
                />
                <Button variant="outline" onClick={handleCreateFolder}>
                  Create folder
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {folders.map((folder) => (
                  <div
                    key={folder.name}
                    className="flex items-center gap-2 rounded-full border border-border bg-secondary/20 px-3 py-1 text-sm"
                  >
                    <Folder className="h-4 w-4 text-muted-foreground" />
                    <span>{folder.name}</span>
                    <Badge variant="outline" className="px-2 py-0 text-[10px]">
                      {folder.count}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              {view === "grid" ? (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredFiles.map((file) => (
                    <FileCard
                      key={file.name}
                      file={file}
                      onMove={handleMoveFile}
                      onDelete={handleDeleteFile}
                    />
                  ))}
                </div>
              ) : null}

              {view === "list" ? (
                <div className="space-y-2">
                  {filteredFiles.map((file) => (
                    <FileRow
                      key={file.name}
                      file={file}
                      onMove={handleMoveFile}
                      onDelete={handleDeleteFile}
                    />
                  ))}
                </div>
              ) : null}

              {view === "table" ? (
                <div className="space-y-2">
                  <div className="grid grid-cols-[minmax(0,1fr)_120px_120px_110px_110px_90px_80px] gap-3 border-b border-border px-3 py-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    <div>Name</div>
                    <div>Folder</div>
                    <div>Modified</div>
                    <div>Size</div>
                    <div>Properties</div>
                    <div>Status</div>
                    <div />
                  </div>
                  {filteredFiles.map((file) => (
                    <FileTableRow
                      key={file.name}
                      file={file}
                      onMove={handleMoveFile}
                      onDelete={handleDeleteFile}
                    />
                  ))}
                </div>
              ) : null}
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

function Properties({ file }) {
  return (
    <div className="flex flex-wrap gap-2 text-xs">
      <Badge variant="outline" className="px-2 py-0 text-[10px]">
        {file.type}
      </Badge>
      <Badge variant="outline" className="px-2 py-0 text-[10px]">
        {file.pages} pages
      </Badge>
    </div>
  );
}

function ActionButtons({ file, onMove, onDelete }) {
  return (
    <div className="flex justify-end gap-1">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        aria-label="Move"
        onClick={() => onMove(file.name)}
      >
        <MoveRight className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        aria-label="Download"
      >
        <Download className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        aria-label="Share"
      >
        <Share2 className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        aria-label="Delete"
        onClick={() => onDelete(file.name)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="More">
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    </div>
  );
}

function FileCard({ file, onMove, onDelete }) {
  return (
    <div className="rounded-xl border border-border bg-background p-4 transition-colors hover:bg-secondary/30">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
            <FileText className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="truncate font-medium">{file.name}</p>
              {file.starred ? (
                <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
              ) : null}
            </div>
            <p className="truncate text-xs text-muted-foreground">
              Resume document
            </p>
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
        <span>{file.updatedAt}</span>
        <span>{file.size}</span>
      </div>
      <div className="mt-3">
        <Properties file={file} />
      </div>
      <div className="mt-3 flex justify-end">
        <ActionButtons file={file} onMove={onMove} onDelete={onDelete} />
      </div>
    </div>
  );
}

function FileRow({ file, onMove, onDelete }) {
  return (
    <div className="rounded-xl border border-border bg-background px-3 py-3 transition-colors hover:bg-secondary/40">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
          <FileText className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate font-medium">{file.name}</p>
            {file.starred ? (
              <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
            ) : null}
          </div>
          <p className="truncate text-xs text-muted-foreground">
            Resume document
          </p>
        </div>
        <Properties file={file} />
        <ActionButtons file={file} onMove={onMove} onDelete={onDelete} />
      </div>
    </div>
  );
}

function FileTableRow({ file, onMove, onDelete }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_120px_120px_110px_110px_90px_80px] items-center gap-3 rounded-xl border border-border bg-background px-3 py-3 transition-colors hover:bg-secondary/40">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
          <FileText className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="truncate font-medium">{file.name}</p>
            {file.starred ? (
              <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
            ) : null}
          </div>
          <p className="truncate text-xs text-muted-foreground">
            Resume document
          </p>
        </div>
      </div>
      <div className="text-sm text-muted-foreground">{file.folder}</div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Clock3 className="h-3.5 w-3.5" />
        {file.updatedAt}
      </div>
      <div className="text-sm text-muted-foreground">{file.size}</div>
      <Properties file={file} />
      <div>
        <Badge variant="outline" className="px-2 py-0 text-[10px]">
          Ready
        </Badge>
      </div>
      <ActionButtons file={file} onMove={onMove} onDelete={onDelete} />
    </div>
  );
}
