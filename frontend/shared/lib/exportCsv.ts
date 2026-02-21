/**
 * Export to CSV utility
 *
 * Converts array of objects to CSV string and triggers download.
 */

export function toCsv<T extends Record<string, unknown>>(rows: T[], columns?: (keyof T)[]): string {
  const keys = columns ?? (rows[0] ? (Object.keys(rows[0]) as (keyof T)[]) : [])
  const header = keys.map((k) => `"${String(k).replace(/"/g, '""')}"`).join(",")
  const body = rows
    .map((row) =>
      keys
        .map((k) => {
          const v = row[k]
          if (v == null) return '""'
          const s = typeof v === "object" ? JSON.stringify(v) : String(v)
          return `"${s.replace(/"/g, '""')}"`
        })
        .join(",")
    )
    .join("\n")
  return `${header}\n${body}`
}

export function downloadCsv(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename.endsWith(".csv") ? filename : `${filename}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export function exportToCsv<T extends Record<string, unknown>>(
  rows: T[],
  filename: string,
  columns?: (keyof T)[]
) {
  const csv = toCsv(rows, columns)
  downloadCsv(csv, filename)
}
