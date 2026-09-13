"use client";

import React, { useState } from "react";
import { DataTable, type Column } from "@/components/admin/DataTable";
import type { MockTestItemWithStats } from "@/features/admin/mockTestActions";
import {
  createMockTest,
  updateMockTest,
  duplicateMockTest,
  deleteMockTest,
} from "@/features/admin/mockTestActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { FileCheck2, Plus, Edit2, Copy, Trash2, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export interface MockTestClientProps {
  mockTests: MockTestItemWithStats[];
  companies: { slug: string; name: string }[];
  games: { slug: string; name: string }[];
}

export function MockTestClient({
  mockTests: initialTests,
  companies,
  games,
}: MockTestClientProps) {
  const router = useRouter();
  const [testsList, setTestsList] = useState<MockTestItemWithStats[]>(initialTests);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTest, setEditingTest] = useState<MockTestItemWithStats | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    companySlug: companies[0]?.slug || "capgemini",
    gameSlugs: [] as string[],
    timeLimit: 45,
    difficulty: "medium",
    passingScore: 70,
  });
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    id: string;
    name: string;
  }>({ open: false, id: "", name: "" });

  const handleOpenCreate = () => {
    setEditingTest(null);
    setFormData({
      name: "",
      slug: "",
      companySlug: companies[0]?.slug || "capgemini",
      gameSlugs: games.slice(0, 3).map((g) => g.slug),
      timeLimit: 45,
      difficulty: "medium",
      passingScore: 70,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (t: MockTestItemWithStats) => {
    setEditingTest(t);
    setFormData({
      name: t.name,
      slug: t.slug,
      companySlug: t.companySlug,
      gameSlugs: t.gameSlugs || [],
      timeLimit: t.timeLimit,
      difficulty: t.difficulty,
      passingScore: t.passingScore,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingTest) {
        await updateMockTest(editingTest.id, formData);
        toast.success("Mock assessment updated");
      } else {
        await createMockTest(formData);
        toast.success("Mock assessment created");
      }
      setModalOpen(false);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to save mock test");
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublish = async (t: MockTestItemWithStats) => {
    const nextStatus = t.status === "published" ? "draft" : "published";
    try {
      await updateMockTest(t.id, { status: nextStatus });
      toast.success(`Mock test ${nextStatus}`);
      router.refresh();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDuplicate = async (t: MockTestItemWithStats) => {
    try {
      await duplicateMockTest(t.id);
      toast.success(`Duplicated ${t.name}`);
      router.refresh();
    } catch {
      toast.error("Failed to duplicate test");
    }
  };

  const toggleGameSlug = (slug: string) => {
    if (formData.gameSlugs.includes(slug)) {
      setFormData({
        ...formData,
        gameSlugs: formData.gameSlugs.filter((s) => s !== slug),
      });
    } else {
      setFormData({ ...formData, gameSlugs: [...formData.gameSlugs, slug] });
    }
  };

  const columns: Column<MockTestItemWithStats>[] = [
    {
      key: "name",
      header: "Assessment Name",
      sortable: true,
      render: (t) => (
        <div className="flex flex-col">
          <span className="font-semibold text-foreground">{t.name}</span>
          <span className="text-[10px] text-muted-foreground font-mono">
            {t.gameSlugs.length} challenge rounds included
          </span>
        </div>
      ),
    },
    {
      key: "companyName",
      header: "Company",
      render: (t) => (
        <span className="capitalize font-medium text-xs text-foreground">
          {t.companyName || t.companySlug}
        </span>
      ),
    },
    {
      key: "timeLimit",
      header: "Duration",
      align: "center",
      render: (t) => (
        <span className="font-mono text-xs text-muted-foreground">
          {t.timeLimit} mins
        </span>
      ),
    },
    {
      key: "passingScore",
      header: "Pass Req",
      align: "center",
      render: (t) => (
        <span className="font-mono text-xs text-foreground">
          {t.passingScore}%
        </span>
      ),
    },
    {
      key: "totalAttempts",
      header: "Attempts",
      align: "right",
      sortable: true,
      render: (t) => (
        <span className="font-mono font-bold text-foreground">
          {t.totalAttempts.toLocaleString()}
        </span>
      ),
    },
    {
      key: "passRate",
      header: "Pass Rate",
      align: "right",
      render: (t) => (
        <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
          {t.totalAttempts > 0 ? `${t.passRate}%` : "—"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      align: "center",
      render: (t) => (
        <span
          className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
            t.status === "published"
              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
              : "bg-amber-500/10 text-amber-600 border-amber-500/20"
          }`}
        >
          {t.status.toUpperCase()}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (t) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0"
            onClick={() => handleTogglePublish(t)}
            title={t.status === "published" ? "Unpublish" : "Publish"}
          >
            {t.status === "published" ? (
              <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />
            ) : (
              <Eye className="h-3.5 w-3.5 text-emerald-600" />
            )}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0"
            onClick={() => handleOpenEdit(t)}
            title="Edit Assessment"
          >
            <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0"
            onClick={() => handleDuplicate(t)}
            title="Duplicate Test"
          >
            <Copy className="h-3.5 w-3.5 text-muted-foreground" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0 text-rose-500 hover:text-rose-600"
            onClick={() => setDeleteConfirm({ open: true, id: t.id, name: t.name })}
            title="Delete Test"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Mock Placement Tests
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configure multi-round employer cognitive assessments and scoring benchmarks. Total: {testsList.length}
          </p>
        </div>

        <Button
          size="sm"
          onClick={handleOpenCreate}
          className="h-8 text-xs gap-1.5 cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          Create Mock Test
        </Button>
      </div>

      <DataTable
        data={testsList}
        columns={columns}
        keyExtractor={(t) => t.id}
        searchPlaceholder="Search mock test by name..."
        searchKey={(t) => `${t.name} ${t.companySlug}`}
      />

      {/* Create / Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">
              {editingTest ? "Edit Mock Test" : "Create Company Assessment"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-3 mt-2 text-xs">
            <div>
              <label className="font-medium text-foreground block mb-1">
                Assessment Title
              </label>
              <Input
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: e.target.value,
                    slug: editingTest
                      ? formData.slug
                      : e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
                  })
                }
                placeholder="e.g. Capgemini Game-Based Aptitude Mock"
                className="h-8 text-xs font-sans"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-medium text-foreground block mb-1">
                  Target Company
                </label>
                <select
                  value={formData.companySlug}
                  onChange={(e) =>
                    setFormData({ ...formData, companySlug: e.target.value })
                  }
                  className="w-full h-8 rounded-md border border-border bg-card px-2 text-xs"
                >
                  {companies.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-medium text-foreground block mb-1">
                  Difficulty Level
                </label>
                <select
                  value={formData.difficulty}
                  onChange={(e) =>
                    setFormData({ ...formData, difficulty: e.target.value })
                  }
                  className="w-full h-8 rounded-md border border-border bg-card px-2 text-xs"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-medium text-foreground block mb-1">
                  Total Time Limit (Minutes)
                </label>
                <Input
                  type="number"
                  value={formData.timeLimit}
                  onChange={(e) =>
                    setFormData({ ...formData, timeLimit: Number(e.target.value) })
                  }
                  className="h-8 text-xs font-mono"
                />
              </div>

              <div>
                <label className="font-medium text-foreground block mb-1">
                  Passing Score (%)
                </label>
                <Input
                  type="number"
                  value={formData.passingScore}
                  onChange={(e) =>
                    setFormData({ ...formData, passingScore: Number(e.target.value) })
                  }
                  className="h-8 text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="font-medium text-foreground block mb-1.5">
                Included Challenge Games ({formData.gameSlugs.length} selected)
              </label>
              <div className="grid grid-cols-2 gap-1.5 max-h-40 overflow-y-auto rounded-lg border border-border/70 p-2 bg-muted/20">
                {games.map((g) => {
                  const selected = formData.gameSlugs.includes(g.slug);
                  return (
                    <button
                      type="button"
                      key={g.slug}
                      onClick={() => toggleGameSlug(g.slug)}
                      className={`flex items-center gap-2 rounded p-1.5 text-left text-xs transition-colors cursor-pointer ${
                        selected
                          ? "bg-primary/10 text-primary font-semibold"
                          : "hover:bg-muted/40 text-muted-foreground"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selected}
                        readOnly
                        className="rounded"
                      />
                      <span className="truncate">{g.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <DialogFooter className="pt-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={saving}>
                {saving ? "Saving..." : editingTest ? "Update Mock Test" : "Create Test"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteConfirm.open}
        onOpenChange={(open) => setDeleteConfirm((s) => ({ ...s, open }))}
        title={`Delete mock test ${deleteConfirm.name}?`}
        description="This will remove the mock assessment from the platform curriculum."
        onConfirm={async () => {
          await deleteMockTest(deleteConfirm.id);
          toast.success("Mock test deleted");
          router.refresh();
        }}
      />
    </div>
  );
}
