"use client";

import React, { useState } from "react";
import { DataTable, type Column } from "@/components/admin/DataTable";
import {
  createContentItem,
  updateContentItem,
  deleteContentItem,
} from "@/features/admin/contentActions";
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
import { BookOpen, Plus, Edit2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export interface ContentItemRow {
  id: string;
  type: string;
  gameSlug: string | null;
  companySlug: string | null;
  title: string;
  content: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export function ContentClient({
  contentItems: initialItems,
  games,
}: {
  contentItems: ContentItemRow[];
  games: { slug: string; name: string }[];
}) {
  const router = useRouter();
  const [items, setItems] = useState<ContentItemRow[]>(initialItems);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ContentItemRow | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    type: "instruction",
    gameSlug: games[0]?.slug || "",
    content: "",
  });
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    id: string;
    title: string;
  }>({ open: false, id: "", title: "" });

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({
      title: "",
      type: "instruction",
      gameSlug: games[0]?.slug || "",
      content: "",
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item: ContentItemRow) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      type: item.type,
      gameSlug: item.gameSlug || "",
      content: item.content,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingItem) {
        await updateContentItem(editingItem.id, formData);
        toast.success("Content item updated");
      } else {
        await createContentItem(formData);
        toast.success("Content item created");
      }
      setModalOpen(false);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to save content");
    } finally {
      setSaving(false);
    }
  };

  const columns: Column<ContentItemRow>[] = [
    {
      key: "title",
      header: "Title",
      sortable: true,
      render: (c) => (
        <div className="flex flex-col">
          <span className="font-semibold text-foreground">{c.title}</span>
          <span className="text-[11px] text-muted-foreground truncate max-w-[280px]">
            {c.content}
          </span>
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      render: (c) => (
        <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground capitalize">
          {c.type}
        </span>
      ),
    },
    {
      key: "gameSlug",
      header: "Associated Challenge",
      render: (c) => (
        <span className="font-mono text-xs text-foreground">
          {c.gameSlug || "Platform-wide"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      align: "center",
      render: (c) => (
        <span
          className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
            c.status === "published"
              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {c.status.toUpperCase()}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (c) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0"
            onClick={() => handleOpenEdit(c)}
            title="Edit Item"
          >
            <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0 text-rose-500 hover:text-rose-600"
            onClick={() => setDeleteConfirm({ open: true, id: c.id, title: c.title })}
            title="Delete Item"
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
            Content Management
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage challenge instructions, tutorial guides, explanations, and learning materials. Total: {items.length}
          </p>
        </div>

        <Button
          size="sm"
          onClick={handleOpenCreate}
          className="h-8 text-xs gap-1.5 cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Content
        </Button>
      </div>

      <DataTable
        data={items}
        columns={columns}
        keyExtractor={(c) => c.id}
        searchPlaceholder="Search content by title or topic..."
        searchKey={(c) => `${c.title} ${c.type} ${c.gameSlug || ""}`}
      />

      {/* Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">
              {editingItem ? "Edit Content Item" : "Create Learning Resource"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-3 mt-2 text-xs">
            <div>
              <label className="font-medium text-foreground block mb-1">
                Resource Title
              </label>
              <Input
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Switch Challenge Permutation Matrix Explanation"
                className="h-8 text-xs font-sans"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-medium text-foreground block mb-1">
                  Content Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full h-8 rounded-md border border-border bg-card px-2 text-xs"
                >
                  <option value="instruction">Instruction</option>
                  <option value="explanation">Explanation</option>
                  <option value="tutorial">Tutorial</option>
                  <option value="question">Question</option>
                  <option value="resource">Learning Resource</option>
                </select>
              </div>

              <div>
                <label className="font-medium text-foreground block mb-1">
                  Target Challenge Game
                </label>
                <select
                  value={formData.gameSlug}
                  onChange={(e) =>
                    setFormData({ ...formData, gameSlug: e.target.value })
                  }
                  className="w-full h-8 rounded-md border border-border bg-card px-2 text-xs"
                >
                  <option value="">General / Platform</option>
                  {games.map((g) => (
                    <option key={g.slug} value={g.slug}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="font-medium text-foreground block mb-1">
                Content Body (Markdown)
              </label>
              <Textarea
                required
                rows={6}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Write full instruction text, explanation steps, or tutorial details..."
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
                {saving ? "Saving..." : editingItem ? "Update Item" : "Create Item"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteConfirm.open}
        onOpenChange={(open) => setDeleteConfirm((s) => ({ ...s, open }))}
        title={`Delete "${deleteConfirm.title}"?`}
        description="This will permanently delete this learning resource."
        onConfirm={async () => {
          await deleteContentItem(deleteConfirm.id);
          toast.success("Content item deleted");
          router.refresh();
        }}
      />
    </div>
  );
}
