/**
 * Super Admin Seed Data Loader
 *
 * Loads seed data from JSON files for the Super Admin app.
 * Mirrors the tenant frontend seed loader, but scoped locally.
 */

import pageantsData from "./pageants.json"
import tenantsData from "./tenants.json"
import contentPostsData from "./contentPosts.json"
import walletsData from "./wallets.json"
import transactionsData from "./transactions.json"
import moderationLogsData from "./moderationLogs.json"
import talentsData from "./talents.json"
import bookingsData from "./bookings.json"
import staffData from "./staff.json"
import usersData from "./users.json"
import abuseReportsData from "./abuseReports.json"
import featureFlagsData from "./featureFlags.json"
import rolloutsData from "./rollouts.json"
import platformConfigData from "./platformConfig.json"
import billingPlansData from "./billingPlans.json"
import revenueReportsData from "./revenueReports.json"
import escrowAccountsData from "./escrowAccounts.json"
import paymentRiskFlagsData from "./paymentRiskFlags.json"
import disputesData from "./disputes.json"
import enforcementActionsData from "./enforcementActions.json"
import appealsData from "./appeals.json"
import takedownsData from "./takedowns.json"
import automationWorkflowsData from "./automationWorkflows.json"
import securityIncidentsData from "./securityIncidents.json"
import securityThreatsData from "./securityThreats.json"
import analyticsAlertsData from "./analyticsAlerts.json"
import complianceMappingData from "./complianceMapping.json"
import apiKeysData from "./apiKeys.json"
import webhooksData from "./webhooks.json"
import deploymentsData from "./deployments.json"
import maintenanceWindowsData from "./maintenanceWindows.json"
import retentionPoliciesData from "./retentionPolicies.json"
import legalHoldsData from "./legalHolds.json"
import dsrRequestsData from "./dsrRequests.json"
import partnersData from "./partners.json"
import subTenantLinksData from "./sub_tenant_links.json"

// Type assertions - keep simple for now
export const seedPageants = pageantsData as any[]
export const seedTenants = tenantsData as any[]
export const seedTalents = talentsData as any[]
export const seedBookings = bookingsData as any[]
export const seedStaff = staffData as any[]
export const seedContentPosts = contentPostsData as any[]
export const seedWallets = walletsData as any[]
export const seedTransactions = transactionsData as any[]
export const seedModerationLogs = moderationLogsData as any[]
export const seedUsers = usersData as any[]
export const seedAbuseReports = abuseReportsData as any[]
export const seedFeatureFlags = featureFlagsData as any[]
export const seedRollouts = rolloutsData as any[]
export const seedPlatformConfig = platformConfigData as any
export const seedBillingPlans = billingPlansData as any[]
export const seedRevenueReports = revenueReportsData as any[]
export const seedEscrowAccounts = escrowAccountsData as any[]
export const seedPaymentRiskFlags = paymentRiskFlagsData as any[]
export const seedDisputes = disputesData as any[]
export const seedEnforcementActions = enforcementActionsData as any[]
export const seedAppeals = appealsData as any[]
export const seedTakedowns = takedownsData as any[]
export const seedAutomationWorkflows = automationWorkflowsData as any[]
export const seedSecurityIncidents = securityIncidentsData as any[]
export const seedSecurityThreats = securityThreatsData as any[]
export const seedAnalyticsAlerts = analyticsAlertsData as any[]
export const seedComplianceMapping = complianceMappingData as any
export const seedApiKeys = apiKeysData as any[]
export const seedWebhooks = webhooksData as any[]
export const seedDeployments = deploymentsData as any[]
export const seedMaintenanceWindows = maintenanceWindowsData as any[]
export const seedRetentionPolicies = retentionPoliciesData as any[]
export const seedLegalHolds = legalHoldsData as any[]
export const seedDsrRequests = dsrRequestsData as any[]
export const seedPartners = partnersData as any[]
export const seedSubTenantLinks = subTenantLinksData as { groupId: string; subTenantId: string; linkedAt: string }[]

export const getAllSeedData = () => ({
  pageants: seedPageants,
  tenants: seedTenants,
  talents: seedTalents,
  bookings: seedBookings,
  staff: seedStaff,
  contentPosts: seedContentPosts,
  wallets: seedWallets,
  transactions: seedTransactions,
  moderationLogs: seedModerationLogs,
  users: seedUsers,
  abuseReports: seedAbuseReports,
  featureFlags: seedFeatureFlags,
  rollouts: seedRollouts,
  platformConfig: seedPlatformConfig,
  billingPlans: seedBillingPlans,
  revenueReports: seedRevenueReports,
  escrowAccounts: seedEscrowAccounts,
  paymentRiskFlags: seedPaymentRiskFlags,
  disputes: seedDisputes,
  enforcementActions: seedEnforcementActions,
  appeals: seedAppeals,
  takedowns: seedTakedowns,
  automationWorkflows: seedAutomationWorkflows,
  securityIncidents: seedSecurityIncidents,
  securityThreats: seedSecurityThreats,
  analyticsAlerts: seedAnalyticsAlerts,
  complianceMapping: seedComplianceMapping,
  apiKeys: seedApiKeys,
  webhooks: seedWebhooks,
  deployments: seedDeployments,
  maintenanceWindows: seedMaintenanceWindows,
  retentionPolicies: seedRetentionPolicies,
  legalHolds: seedLegalHolds,
  dsrRequests: seedDsrRequests,
  partners: seedPartners,
})

