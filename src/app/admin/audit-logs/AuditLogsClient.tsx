"use client";

import React, { useState } from "react";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { ShieldAlert, ShieldCheck, Eye, Terminal } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export interface AuditLogItem {
  id: string;
  adminId: string;
  adminEmail: string;
  adminName: string | null;
  action: string;
  targetType: string;
  targetId: string;
  metadata: any;
  ipAddress: string | null;
  createdAt: Date;
}

export function AuditLogsClient({ logs }: { logs: AuditLogItem[] }) {
  const [selectedLog, setSelectedLog] = useState<AuditLogItem | null>(null);

  const columns: Column<AuditLogItem>[] = [
    {
      key: "action",
      header: "Action Event",
      sortable: true,
      render: (l) => (
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-muted/60 text-muted-foreground">
            <Terminal className="h-3 w-3" />
          </div>
          <span className="font-mono font-semibold text-foreground text-xs">
            {l.action}
          </span>
        </div>
      ),
    },
    {
      key: "adminEmail",
      header: "Administrator",
      render: (l) => (
        <div className="flex flex-col">
          <span className="font-medium text-foreground">{l.adminName || "Admin"}</span>
          <span className="font-mono text-[10px] text-muted-foreground">
            {l.adminEmail}
          </span>
        </div>
      ),
    },
    {
      key: "targetType",
      header: "Target Entity",
      render: (l) => (
        <div className="flex items-center gap-1.5 font-mono text-xs">
          <span className="capitalize text-muted-foreground">{l.targetType}:</span>
          <span className="text-foreground truncate max-w-[140px]">{l.targetId}</span>
        </div>
      ),
    },
    {
      key: "createdAt",
      header: "Timestamp",
      align: "right",
      sortable: true,
      render: (l) => (
        <span className="font-mono text-muted-foreground text-[11px]">
          {new Date(l.createdAt).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
        </span>
      ),
    },
    {
      key: "details",
      header: "Details",
      align: "right",
      render: (l) => (
        <Button
          size="sm"
          variant="ghost"
          className="h-7 text-xs gap-1"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedLog(l);
          }}
        >
          <Eye className="h-3.5 w-3.5" />
          View
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          System Audit Logs
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Immutable ledger of security-sensitive administrator actions, plan alterations, and system configuration updates. Total: {logs.length}
        </p>
      </div>

      <DataTable
        data={logs}
        columns={columns}
        keyExtractor={(l) => l.id}
        searchPlaceholder="Search audit events by action or admin..."
        searchKey={(l) => `${l.action} ${l.adminEmail} ${l.targetId}`}
      />

      {/* Detail Dialog */}
      <Dialog open={!!selectedLog} onOpenChange={(open) => !open && setSelectedLog(null)}>
        {selectedLog && (
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-sm font-semibold font-mono">
                Audit Event: {selectedLog.action}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-3 text-xs mt-2 font-mono">
              <div className="flex justify-between">
                <span className="text-muted-foreground font-sans">Admin:</span>
                <span className="text-foreground">{selectedLog.adminEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground font-sans">Target:</span>
                <span className="text-foreground">
                  {selectedLog.targetType} ({selectedLog.targetId})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground font-sans">Timestamp:</span>
                <span className="text-foreground">
                  {new Date(selectedLog.createdAt).toUTCString()}
                </span>
              </div>

              {selectedLog.metadata && (
                <div className="pt-2">
                  <span className="text-muted-foreground font-sans block mb-1">
                    Event Payload / Context
                  </span>
                  <pre className="rounded bg-muted/40 p-2.5 text-[11px] overflow-x-auto text-muted-foreground">
                    {JSON.stringify(selectedLog.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button size="sm" variant="outline" onClick={() => setSelectedLog(null)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
