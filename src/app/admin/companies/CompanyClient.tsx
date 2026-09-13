"use client";

import React, { useState } from "react";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { createCompany, updateCompany, deleteCompany } from "@/features/admin/companyActions";
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
import { Building2, Plus, Edit2, Archive, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export interface CompanyItem {
  id: string;
  slug: string;
  name: string;
  logo: string | null;
  website: string | null;
  description: string | null;
  assessmentType: string | null;
  status: string;
  region: string | null;
  monogram: string | null;
  accent: string | null;
  gamesCount: number;
  mockTestsCount: number;
}

export function CompanyClient({
  companies: initialCompanies,
}: {
  companies: CompanyItem[];
}) {
  const router = useRouter();
  const [companiesList, setCompaniesList] = useState<CompanyItem[]>(initialCompanies);
  const [activeFilter, setActiveFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<CompanyItem | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    logo: "",
    website: "",
    description: "",
    assessmentType: "Cognitive Assessment",
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
    { label: "Archived", value: "archived" },
  ];

  const filtered = companiesList.filter((c) => {
    if (activeFilter === "active") return c.status === "active";
    if (activeFilter === "archived") return c.status === "archived";
    return true;
  });

  const handleOpenCreate = () => {
    setEditingCompany(null);
    setFormData({
      name: "",
      slug: "",
      logo: "",
      website: "",
      description: "",
      assessmentType: "Cognitive Assessment",
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (c: CompanyItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingCompany(c);
    setFormData({
      name: c.name,
      slug: c.slug,
      logo: c.logo || "",
      website: c.website || "",
      description: c.description || "",
      assessmentType: c.assessmentType || "Cognitive Assessment",
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingCompany) {
        await updateCompany(editingCompany.id, {
          name: formData.name,
          logo: formData.logo,
          website: formData.website,
          description: formData.description,
          assessmentType: formData.assessmentType,
        });
        toast.success("Company updated");
      } else {
        await createCompany(formData);
        toast.success("Company created");
      }
      setModalOpen(false);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Operation failed");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleArchive = async (c: CompanyItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const newStatus = c.status === "active" ? "archived" : "active";
    try {
      await updateCompany(c.id, { status: newStatus });
      toast.success(`Company ${newStatus}`);
      router.refresh();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = (c: CompanyItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteConfirm({ open: true, id: c.id, name: c.name });
  };

  const columns: Column<CompanyItem>[] = [
    {
      key: "name",
      header: "Company",
      sortable: true,
      render: (c) => (
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/80 bg-muted/40 overflow-hidden relative shrink-0">
            {c.logo ? (
              <Image
                src={c.logo}
                alt={c.name}
                width={32}
                height={32}
                className="object-contain p-1"
              />
            ) : (
              <span className="font-bold text-xs text-foreground">
                {c.monogram || c.name.slice(0, 2).toUpperCase()}
              </span>
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-foreground truncate">{c.name}</span>
            <span className="text-[10px] text-muted-foreground font-mono">{c.slug}</span>
          </div>
        </div>
      ),
    },
    {
      key: "assessmentType",
      header: "Assessment Pattern",
      render: (c) => (
        <span className="text-xs text-muted-foreground">
          {c.assessmentType || "Cognitive Assessment"}
        </span>
      ),
    },
    {
      key: "gamesCount",
      header: "Games",
      align: "center",
      render: (c) => (
        <span className="font-mono font-medium text-foreground">
          {c.gamesCount}
        </span>
      ),
    },
    {
      key: "mockTestsCount",
      header: "Mock Tests",
      align: "center",
      render: (c) => (
        <span className="font-mono font-medium text-foreground">
          {c.mockTestsCount}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      align: "center",
      render: (c) => (
        <span
          className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${
            c.status === "active"
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
            onClick={(e) => handleOpenEdit(c, e)}
            title="Edit Company"
          >
            <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0"
            onClick={(e) => handleToggleArchive(c, e)}
            title={c.status === "active" ? "Archive" : "Activate"}
          >
            <Archive className="h-3.5 w-3.5 text-muted-foreground" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20"
            onClick={(e) => handleDelete(c, e)}
            title="Delete Company"
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
            Companies Directory
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage corporate recruitment patterns, official logos, and assessment rounds. Total: {companiesList.length}
          </p>
        </div>

        <Button
          size="sm"
          onClick={handleOpenCreate}
          className="h-8 text-xs gap-1.5 cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Company
        </Button>
      </div>

      <DataTable
        data={filtered}
        columns={columns}
        keyExtractor={(c) => c.id}
        searchPlaceholder="Search company..."
        searchKey={(c) => `${c.name} ${c.slug} ${c.assessmentType || ""}`}
        filterOptions={filterOptions}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        onRowClick={(c) => router.push(`/admin/companies/${c.slug}`)}
      />

      {/* Create / Edit Dialog */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">
              {editingCompany ? "Edit Company" : "Add New Company"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-3 mt-2 text-xs">
            <div>
              <label className="font-medium text-foreground block mb-1">
                Company Name
              </label>
              <Input
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: e.target.value,
                    slug: editingCompany
                      ? formData.slug
                      : e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
                  })
                }
                placeholder="e.g. Capgemini"
                className="h-8 text-xs font-sans"
              />
            </div>

            <div>
              <label className="font-medium text-foreground block mb-1">
                Slug (URL Identifier)
              </label>
              <Input
                required
                disabled={!!editingCompany}
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="e.g. capgemini"
                className="h-8 text-xs font-mono"
              />
            </div>

            <div>
              <label className="font-medium text-foreground block mb-1">
                Assessment Type Label
              </label>
              <Input
                value={formData.assessmentType}
                onChange={(e) =>
                  setFormData({ ...formData, assessmentType: e.target.value })
                }
                placeholder="e.g. Game-Based Aptitude"
                className="h-8 text-xs font-sans"
              />
            </div>

            <div>
              <label className="font-medium text-foreground block mb-1">
                Official Logo Asset Path
              </label>
              <Input
                value={formData.logo}
                onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                placeholder="e.g. /capgeminiLogo.png or /accenture.png"
                className="h-8 text-xs font-mono"
              />
            </div>

            <div>
              <label className="font-medium text-foreground block mb-1">
                Website
              </label>
              <Input
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://company.com"
                className="h-8 text-xs font-sans"
              />
            </div>

            <div>
              <label className="font-medium text-foreground block mb-1">
                Description
              </label>
              <Textarea
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Brief summary of company hiring assessment rounds..."
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
                {saving ? "Saving..." : editingCompany ? "Update Company" : "Create Company"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteConfirm.open}
        onOpenChange={(open) => setDeleteConfirm((s) => ({ ...s, open }))}
        title={`Permanently delete ${deleteConfirm.name}?`}
        description="This will remove the company record from the directory."
        onConfirm={async () => {
          await deleteCompany(deleteConfirm.id);
          toast.success("Company deleted");
          router.refresh();
        }}
      />
    </div>
  );
}
