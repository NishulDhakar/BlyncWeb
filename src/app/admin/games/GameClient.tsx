"use client";

import React, { useState } from "react";
import { DataTable, type Column } from "@/components/admin/DataTable";
import type { GameItemWithStats } from "@/features/admin/gameActions";
import {
  createGame,
  updateGame,
  duplicateGame,
  deleteGame,
} from "@/features/admin/gameActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import {
  Gamepad2,
  Plus,
  Edit2,
  Copy,
  Archive,
  Trash2,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export interface GameClientProps {
  games: GameItemWithStats[];
}

export function GameClient({ games: initialGames }: GameClientProps) {
  const router = useRouter();
  const [gamesList, setGamesList] = useState<GameItemWithStats[]>(initialGames);
  const [activeFilter, setActiveFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGame, setEditingGame] = useState<GameItemWithStats | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    category: "cognitive",
    difficulty: "medium",
    duration: "3-5 min",
    timeLimit: 180,
    rounds: 15,
    companySlug: "capgemini",
    pro: false,
  });
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    id: string;
    name: string;
  }>({ open: false, id: "", name: "" });

  const filterOptions = [
    { label: "All", value: "all" },
    { label: "Active", value: "active" },
    { label: "Draft", value: "draft" },
    { label: "Archived", value: "archived" },
  ];

  const filtered = gamesList.filter((g) => {
    if (activeFilter === "active") return g.status === "active";
    if (activeFilter === "draft") return g.status === "draft";
    if (activeFilter === "archived") return g.status === "archived";
    return true;
  });

  const handleOpenCreate = () => {
    setEditingGame(null);
    setFormData({
      name: "",
      slug: "",
      description: "",
      category: "cognitive",
      difficulty: "medium",
      duration: "3-5 min",
      timeLimit: 180,
      rounds: 15,
      companySlug: "capgemini",
      pro: false,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (g: GameItemWithStats) => {
    setEditingGame(g);
    setFormData({
      name: g.name,
      slug: g.slug,
      description: g.description || "",
      category: g.category,
      difficulty: g.difficulty,
      duration: g.duration || "3-5 min",
      timeLimit: g.timeLimit || 180,
      rounds: g.rounds || 15,
      companySlug: g.companySlug || "capgemini",
      pro: g.pro || false,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingGame) {
        await updateGame(editingGame.id, formData);
        toast.success("Game updated");
      } else {
        await createGame(formData);
        toast.success("Game created");
      }
      setModalOpen(false);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Operation failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDuplicate = async (g: GameItemWithStats) => {
    try {
      await duplicateGame(g.id);
      toast.success(`Duplicated ${g.name}`);
      router.refresh();
    } catch {
      toast.error("Failed to duplicate game");
    }
  };

  const handleToggleStatus = async (g: GameItemWithStats) => {
    const nextStatus = g.status === "active" ? "archived" : "active";
    try {
      await updateGame(g.id, { status: nextStatus });
      toast.success(`Game status changed to ${nextStatus}`);
      router.refresh();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const columns: Column<GameItemWithStats>[] = [
    {
      key: "name",
      header: "Challenge Game",
      sortable: true,
      render: (g) => (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-foreground">{g.name}</span>
            {g.pro && (
              <span className="rounded bg-amber-500/10 px-1 py-0.2 text-[9px] font-bold text-amber-500">
                PRO
              </span>
            )}
          </div>
          <span className="text-[10px] text-muted-foreground font-mono">
            /play/{g.slug}
          </span>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      render: (g) => (
        <span className="capitalize text-xs text-muted-foreground font-medium">
          {g.category}
        </span>
      ),
    },
    {
      key: "difficulty",
      header: "Difficulty",
      render: (g) => {
        const colors: Record<string, string> = {
          easy: "text-emerald-500",
          medium: "text-amber-500",
          hard: "text-rose-500",
        };
        return (
          <span className={`capitalize text-xs font-semibold ${colors[g.difficulty] || ""}`}>
            {g.difficulty}
          </span>
        );
      },
    },
    {
      key: "timeLimit",
      header: "Timing",
      align: "center",
      render: (g) => (
        <span className="font-mono text-xs text-muted-foreground">
          {g.timeLimit ? `${g.timeLimit}s` : "—"} ({g.rounds || "—"} rds)
        </span>
      ),
    },
    {
      key: "totalAttempts",
      header: "Attempts",
      align: "right",
      sortable: true,
      render: (g) => (
        <span className="font-mono font-bold text-foreground">
          {g.totalAttempts.toLocaleString()}
        </span>
      ),
    },
    {
      key: "averageScore",
      header: "Avg Score",
      align: "right",
      sortable: true,
      render: (g) => (
        <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
          {g.averageScore}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      align: "center",
      render: (g) => {
        const colors: Record<string, string> = {
          active: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
          draft: "bg-amber-500/10 text-amber-600 border-amber-500/20",
          archived: "bg-muted text-muted-foreground",
        };
        return (
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
              colors[g.status] || "bg-muted"
            }`}
          >
            {g.status.toUpperCase()}
          </span>
        );
      },
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (g) => (
        <div className="flex items-center justify-end gap-1">
          <Link
            href={`/play/${g.slug}`}
            target="_blank"
            className="rounded p-1 text-muted-foreground hover:text-foreground transition-colors"
            title="Play Test"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0"
            onClick={() => handleOpenEdit(g)}
            title="Edit Game"
          >
            <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0"
            onClick={() => handleDuplicate(g)}
            title="Duplicate Game"
          >
            <Copy className="h-3.5 w-3.5 text-muted-foreground" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0"
            onClick={() => handleToggleStatus(g)}
            title={g.status === "active" ? "Archive" : "Activate"}
          >
            <Archive className="h-3.5 w-3.5 text-muted-foreground" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0 text-rose-500 hover:text-rose-600"
            onClick={() => setDeleteConfirm({ open: true, id: g.id, name: g.name })}
            title="Delete Game"
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
            Cognitive Challenge Games
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage interactive test modules, timing, rounds, and gameplay metrics. Total: {gamesList.length}
          </p>
        </div>

        <Button
          size="sm"
          onClick={handleOpenCreate}
          className="h-8 text-xs gap-1.5 cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Game
        </Button>
      </div>

      <DataTable
        data={filtered}
        columns={columns}
        keyExtractor={(g) => g.id}
        searchPlaceholder="Search games by name or slug..."
        searchKey={(g) => `${g.name} ${g.slug} ${g.category}`}
        filterOptions={filterOptions}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      {/* Create / Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">
              {editingGame ? "Edit Game Parameters" : "Create New Challenge Game"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-3 mt-2 text-xs">
            <div>
              <label className="font-medium text-foreground block mb-1">
                Game Name
              </label>
              <Input
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: e.target.value,
                    slug: editingGame
                      ? formData.slug
                      : e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
                  })
                }
                placeholder="e.g. Switch Challenge"
                className="h-8 text-xs font-sans"
              />
            </div>

            <div>
              <label className="font-medium text-foreground block mb-1">
                Slug (URL Identifier)
              </label>
              <Input
                required
                disabled={!!editingGame}
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="e.g. switch-challenge"
                className="h-8 text-xs font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-medium text-foreground block mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full h-8 rounded-md border border-border bg-card px-2 text-xs"
                >
                  <option value="cognitive">Cognitive</option>
                  <option value="memory">Memory</option>
                  <option value="brain">Brain</option>
                  <option value="quiz">Quiz</option>
                  <option value="communication">Communication</option>
                </select>
              </div>

              <div>
                <label className="font-medium text-foreground block mb-1">
                  Difficulty
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
                  Time Limit (Seconds)
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
                  Rounds Count
                </label>
                <Input
                  type="number"
                  value={formData.rounds}
                  onChange={(e) =>
                    setFormData({ ...formData, rounds: Number(e.target.value) })
                  }
                  className="h-8 text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="font-medium text-foreground block mb-1">
                Description
              </label>
              <Textarea
                rows={2}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Core game mechanic rules and instructions..."
                className="text-xs font-sans"
              />
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
                {saving ? "Saving..." : editingGame ? "Update Game" : "Create Game"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteConfirm.open}
        onOpenChange={(open) => setDeleteConfirm((s) => ({ ...s, open }))}
        title={`Permanently delete ${deleteConfirm.name}?`}
        description="This will delete the game definition from the system database."
        onConfirm={async () => {
          await deleteGame(deleteConfirm.id);
          toast.success("Game deleted");
          router.refresh();
        }}
      />
    </div>
  );
}
