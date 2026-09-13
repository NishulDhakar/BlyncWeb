"use client";

import React, { useState } from "react";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { updateTicketStatus } from "@/features/admin/supportActions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { LifeBuoy, Star, Clock, CheckCircle2, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export interface SupportTicketItem {
  id: string;
  userId: string | null;
  name: string;
  email: string;
  type: string;
  subject: string;
  message: string;
  rating: number | null;
  status: string;
  priority: string;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export function SupportClient({
  tickets: initialTickets,
}: {
  tickets: SupportTicketItem[];
}) {
  const router = useRouter();
  const [ticketsList, setTicketsList] = useState<SupportTicketItem[]>(initialTickets);
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedTicket, setSelectedTicket] = useState<SupportTicketItem | null>(null);
  const [newStatus, setNewStatus] = useState<"open" | "in_progress" | "resolved" | "closed">("open");
  const [adminNotes, setAdminNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const filterOptions = [
    { label: "All", value: "all" },
    { label: "Open", value: "open" },
    { label: "In Progress", value: "in_progress" },
    { label: "Resolved", value: "resolved" },
    { label: "Closed", value: "closed" },
  ];

  const filtered = ticketsList.filter((t) => {
    if (activeFilter === "open") return t.status === "open";
    if (activeFilter === "in_progress") return t.status === "in_progress";
    if (activeFilter === "resolved") return t.status === "resolved";
    if (activeFilter === "closed") return t.status === "closed";
    return true;
  });

  const handleOpenTicket = (t: SupportTicketItem) => {
    setSelectedTicket(t);
    setNewStatus(t.status as any);
    setAdminNotes(t.notes || "");
  };

  const handleSaveStatus = async () => {
    if (!selectedTicket) return;
    setSaving(true);
    try {
      await updateTicketStatus(selectedTicket.id, newStatus, adminNotes);
      toast.success(`Ticket marked as ${newStatus}`);
      setSelectedTicket(null);
      router.refresh();
    } catch {
      toast.error("Failed to update status");
    } finally {
      setSaving(false);
    }
  };

  const columns: Column<SupportTicketItem>[] = [
    {
      key: "subject",
      header: "Subject & Message",
      sortable: true,
      render: (t) => (
        <div className="flex flex-col">
          <span className="font-semibold text-foreground">{t.subject}</span>
          <span className="text-[11px] text-muted-foreground truncate max-w-[280px]">
            {t.message}
          </span>
        </div>
      ),
    },
    {
      key: "name",
      header: "Sender",
      render: (t) => (
        <div className="flex flex-col">
          <span className="font-medium text-foreground">{t.name}</span>
          <span className="text-[10px] text-muted-foreground font-mono truncate max-w-[160px]">
            {t.email}
          </span>
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      render: (t) => (
        <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground capitalize">
          {t.type}
        </span>
      ),
    },
    {
      key: "rating",
      header: "Rating",
      align: "center",
      render: (t) =>
        t.rating ? (
          <span className="inline-flex items-center gap-0.5 text-xs text-amber-500 font-bold">
            <Star className="h-3 w-3 fill-amber-500" />
            {t.rating}/5
          </span>
        ) : (
          <span className="text-muted-foreground text-xs">—</span>
        ),
    },
    {
      key: "status",
      header: "Status",
      align: "center",
      render: (t) => {
        const styles: Record<string, string> = {
          open: "bg-rose-500/10 text-rose-600 border-rose-500/20",
          in_progress: "bg-amber-500/10 text-amber-600 border-amber-500/20",
          resolved: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
          closed: "bg-muted text-muted-foreground",
        };
        return (
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
              styles[t.status] || "bg-muted"
            }`}
          >
            {t.status.replace("_", " ").toUpperCase()}
          </span>
        );
      },
    },
    {
      key: "createdAt",
      header: "Submitted",
      align: "right",
      sortable: true,
      render: (t) => (
        <span className="text-muted-foreground font-mono text-[11px]">
          {new Date(t.createdAt).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            User Support & Inquiries
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage student feedback, bug submissions, placement inquiries, and contact requests. Total: {ticketsList.length}
          </p>
        </div>
      </div>

      <DataTable
        data={filtered}
        columns={columns}
        keyExtractor={(t) => t.id}
        searchPlaceholder="Search tickets by subject, sender, or message..."
        searchKey={(t) => `${t.subject} ${t.message} ${t.name} ${t.email}`}
        filterOptions={filterOptions}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        onRowClick={handleOpenTicket}
      />

      {/* Ticket Details Drawer / Dialog */}
      <Dialog open={!!selectedTicket} onOpenChange={(open) => !open && setSelectedTicket(null)}>
        {selectedTicket && (
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <div className="flex items-center justify-between gap-2">
                <DialogTitle className="text-base font-semibold">
                  {selectedTicket.subject}
                </DialogTitle>
                <span className="text-[10px] font-mono text-muted-foreground">
                  {selectedTicket.id}
                </span>
              </div>
            </DialogHeader>

            <div className="space-y-4 text-xs mt-2">
              <div className="rounded-lg border border-border/70 p-3 bg-muted/20 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">From:</span>
                  <span className="font-semibold text-foreground">
                    {selectedTicket.name} ({selectedTicket.email})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category:</span>
                  <span className="capitalize font-mono">{selectedTicket.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Received:</span>
                  <span className="font-mono">{new Date(selectedTicket.createdAt).toUTCString()}</span>
                </div>
              </div>

              <div>
                <span className="font-semibold text-foreground block mb-1">
                  Message Content
                </span>
                <div className="rounded-lg border border-border/80 bg-card p-3 text-xs leading-relaxed text-foreground whitespace-pre-wrap">
                  {selectedTicket.message}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-foreground block mb-1">
                    Update Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as any)}
                    className="w-full h-8 rounded-md border border-border bg-card px-2 text-xs"
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-medium text-foreground block mb-1">
                  Internal Resolution Notes
                </label>
                <Textarea
                  rows={3}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Notes on resolution, student correspondence, or ticket triage..."
                  className="text-xs font-sans"
                />
              </div>
            </div>

            <DialogFooter className="pt-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSelectedTicket(null)}
              >
                Close
              </Button>
              <Button type="button" size="sm" onClick={handleSaveStatus} disabled={saving}>
                {saving ? "Updating..." : "Update Ticket"}
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
