"use client";
import type { ReactNode } from "react";
import { A } from "./ui";

export interface Column<T> { key: string; header: string; render: (row: T) => ReactNode; width?: string }

export function DataTable<T extends { id?: string; code?: string; key?: string }>({ columns, rows, empty }: { columns: Column<T>[]; rows: T[]; empty: ReactNode }) {
  if (rows.length === 0) return <>{empty}</>;
  return (
    <div style={{ overflowX: "auto", border: `1px solid ${A.border}`, borderRadius: 12 }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14, minWidth: 640 }}>
        <thead>
          <tr>{columns.map((c) => <th key={c.key} style={{ textAlign: "start", padding: "12px 16px", color: A.dim, fontWeight: 600, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: `1px solid ${A.border}`, width: c.width }}>{c.header}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.id ?? row.code ?? row.key ?? i} style={{ borderBottom: i < rows.length - 1 ? `1px solid ${A.border}` : "none" }}>
              {columns.map((c) => <td key={c.key} style={{ padding: "13px 16px", color: A.text, verticalAlign: "middle" }}>{c.render(row)}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
