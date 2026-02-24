"use client"

import Link from "next/link"
import { Shield, Database, Lock, ArrowLeft } from "lucide-react"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import backupConfig from "@/data/seed/backupConfig.json"

type BackupConfig = typeof backupConfig

export default function BackupConfigPage() {
  const cfg = backupConfig as BackupConfig

  return (
    <PageLayout>
      <PageHeader
        title="Backup configuration"
        description="Backup policies, retention settings, storage configuration, and encryption. Seed data only."
        badge={
          <span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]">
            <Shield className="h-3.5 w-3.5 text-[#0078d4]" />
            Backup & recovery
          </span>
        }
        actions={
          <Link href="/integrations">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
              Integrations
            </Button>
          </Link>
        }
      />

      <PageSection title="Overview">
        <MetricsGrid>
          <Card>
            <CardHeader><CardTitle className="text-sm font-semibold">Schedule</CardTitle></CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-[#323130]">
                {cfg.frequency === "daily" ? "Daily" : cfg.frequency}
              </p>
              <p className="mt-1 text-xs text-[#605e5c]">
                At {cfg.timeOfDay} ({cfg.timezone})
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-sm font-semibold">Retention</CardTitle></CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-[#323130]">{cfg.retentionDays} days</p>
              <p className="mt-1 text-xs text-[#605e5c]">
                + {cfg.retentionMonthlySnapshots} monthly · {cfg.retentionYearlySnapshots} yearly
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-sm font-semibold">Last backup</CardTitle></CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-[#107c10]">
                {cfg.lastBackupStatus === "SUCCESS" ? "Success" : cfg.lastBackupStatus}
              </p>
              <p className="mt-1 text-xs text-[#605e5c]">
                {new Date(cfg.lastBackupAt).toLocaleString("en-IN")} · {cfg.lastBackupSizeGb} GB
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-sm font-semibold">Encryption</CardTitle></CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text={cfg.encryptionEnabled ? '#107c10' : '#a80000'}">
                {cfg.encryptionEnabled ? "Enabled" : "Disabled"}
              </p>
              <p className="mt-1 text-xs text-[#605e5c]">
                {cfg.encryptionEnabled ? "KMS key configured" : "Configure KMS before go-live"}
              </p>
            </CardContent>
          </Card>
        </MetricsGrid>
      </PageSection>

      <PageSection title="Storage configuration">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Database className="h-4 w-4 text-[#0078d4]" />
              Primary storage
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 text-sm text-[#323130]">
            <div>
              <p className="text-xs font-medium text-[#605e5c]">Provider</p>
              <p>{cfg.storageProvider}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-[#605e5c]">Region</p>
              <p>{cfg.storageRegion}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-[#605e5c]">Bucket</p>
              <p className="font-mono text-xs">{cfg.storageBucket}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-[#605e5c]">Compression</p>
              <p>{cfg.compression}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-[#605e5c]">Included tenants</p>
              <p>{cfg.includeTenants === "all" ? "All tenants" : cfg.includeTenants}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-[#605e5c]">Excluded tenants</p>
              <p>{cfg.excludeTenants.length ? cfg.excludeTenants.join(", ") : "None"}</p>
            </div>
          </CardContent>
        </Card>
      </PageSection>

      <PageSection title="Encryption & compliance">
        <Card>
          <CardContent className="pt-4 text-sm text-[#605e5c] space-y-3">
            <div className="flex items-start gap-2">
              <Lock className="h-4 w-4 mt-0.5 text-[#0078d4]" />
              <p>
                Backups are encrypted at rest using KMS key{" "}
                <span className="font-mono text-xs text-[#323130]">{cfg.encryptionKmsKey}</span>. In a later phase this section
                will integrate with <span className="font-mono text-xs">GET /v1/superadmin/backup/config</span>.
              </p>
            </div>
            <p>
              Disaster recovery planning will use these settings as the source of truth for RPO/RTO calculations and compliance
              evidence (GDPR, DPDP, SOC 2).
            </p>
          </CardContent>
        </Card>
      </PageSection>
    </PageLayout>
  )
}

