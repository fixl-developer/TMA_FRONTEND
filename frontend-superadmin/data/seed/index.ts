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
import blueprintsData from "./blueprints.json"
import templatesData from "./templates.json"
import workflowsData from "./workflows.json"
import workflowExecutionsData from "./workflowExecutions.json"
import workflowAnalyticsData from "./workflowAnalytics.json"
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
import apiUsageData from "./apiUsage.json"
import apiRateLimitsData from "./apiRateLimits.json"
import apiVersionsData from "./apiVersions.json"
import financeCurrenciesData from "./financeCurrencies.json"
import exchangeRatesData from "./exchangeRates.json"
import conversionHistoryData from "./conversionHistory.json"
import webhooksData from "./webhooks.json"
import deploymentsData from "./deployments.json"
import maintenanceWindowsData from "./maintenanceWindows.json"
import retentionPoliciesData from "./retentionPolicies.json"
import legalHoldsData from "./legalHolds.json"
import dsrRequestsData from "./dsrRequests.json"
import partnersData from "./partners.json"
import subTenantLinksData from "./sub_tenant_links.json"
import automationPacksData from "./automationPacks.json"
import automationRulesData from "./automationRules.json"
import automationLogsData from "./automationLogs.json"
import automationAnalyticsData from "./automationAnalytics.json"
import walletsListData from "./walletsList.json"
import ledgerAccountsData from "./ledgerAccounts.json"
import ledgerEntriesData from "./ledgerEntries.json"
import commissionRulesData from "./commissionRules.json"
import commissionSettlementsData from "./commissionSettlements.json"
import rolesData from "./roles.json"
import policiesData from "./policies.json"
import permissionMatrixData from "./permissionMatrix.json"
import rbacAuditData from "./rbacAudit.json"
import collaborationRequestsData from "./collaborationRequests.json"
import collaborationRoomsData from "./collaborationRooms.json"
import collaborationContractsData from "./collaborationContracts.json"
import collaborationEscrowData from "./collaborationEscrow.json"
import collaborationAnalyticsData from "./collaborationAnalytics.json"
import moderationQueueData from "./moderationQueue.json"
import moderationRulesData from "./moderationRules.json"
import moderatorsData from "./moderators.json"
import moderationAnalyticsData from "./moderationAnalytics.json"
import fraudRiskMonitoringData from "./fraudRiskMonitoring.json"
import fraudModelsData from "./fraudModels.json"
import fraudResponsesData from "./fraudResponses.json"
import fraudThresholdsData from "./fraudThresholds.json"
import wesAnalyticsData from "./wesAnalytics.json"
import wesScoresData from "./wesScores.json"
import wesRecommendationsData from "./wesRecommendations.json"
import wesExecutionsData from "./wesExecutions.json"
import wesBottlenecksData from "./wesBottlenecks.json"
import wesKpisData from "./wesKpis.json"
import platformAnalyticsData from "./platformAnalytics.json"
import tenantAnalyticsData from "./tenantAnalytics.json"
import analyticsReportsData from "./analyticsReports.json"
import revenueAnalyticsData from "./revenueAnalytics.json"
import taxConfigData from "./taxConfig.json"
import gstConfigData from "./gstConfig.json"
import taxReportsData from "./taxReports.json"
import paymentGatewaysData from "./paymentGateways.json"
import paymentAnalyticsData from "./paymentAnalytics.json"
import notificationTemplatesData from "./notificationTemplates.json"
import notificationScheduledData from "./notificationScheduled.json"
import notificationDeliveryData from "./notificationDelivery.json"
import notificationAnalyticsData from "./notificationAnalytics.json"
import backupConfigData from "./backupConfig.json"
import backupJobsData from "./backupJobs.json"
import backupVerificationData from "./backupVerification.json"

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
export const seedBlueprints = blueprintsData as any[]
export const seedTemplates = templatesData as any[]
export const seedWorkflows = workflowsData as any[]
export const seedWorkflowExecutions = workflowExecutionsData as any[]
export const seedWorkflowAnalytics = workflowAnalyticsData as any[]
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
export const seedApiUsage = apiUsageData as any
export const seedApiRateLimits = apiRateLimitsData as any[]
export const seedApiVersions = apiVersionsData as any[]
export const seedFinanceCurrencies = financeCurrenciesData as any[]
export const seedExchangeRates = exchangeRatesData as any
export const seedConversionHistory = conversionHistoryData as any[]
export const seedWebhooks = webhooksData as any[]
export const seedDeployments = deploymentsData as any[]
export const seedMaintenanceWindows = maintenanceWindowsData as any[]
export const seedRetentionPolicies = retentionPoliciesData as any[]
export const seedLegalHolds = legalHoldsData as any[]
export const seedDsrRequests = dsrRequestsData as any[]
export const seedPartners = partnersData as any[]
export const seedSubTenantLinks = subTenantLinksData as { groupId: string; subTenantId: string; linkedAt: string }[]
export const seedAutomationPacks = automationPacksData as any[]
export const seedAutomationRules = automationRulesData as any[]
export const seedAutomationLogs = automationLogsData as any[]
export const seedAutomationAnalytics = automationAnalyticsData as any
export const seedWalletsList = walletsListData as any[]
export const seedLedgerAccounts = ledgerAccountsData as any[]
export const seedLedgerEntries = ledgerEntriesData as any[]
export const seedCommissionRules = commissionRulesData as any[]
export const seedCommissionSettlements = commissionSettlementsData as any[]
export const seedRoles = rolesData as any[]
export const seedPolicies = policiesData as any[]
export const seedPermissionMatrix = permissionMatrixData as any[]
export const seedRbacAudit = rbacAuditData as any[]
export const seedCollaborationRequests = collaborationRequestsData as any[]
export const seedCollaborationRooms = collaborationRoomsData as any[]
export const seedCollaborationContracts = collaborationContractsData as any[]
export const seedCollaborationEscrow = collaborationEscrowData as any[]
export const seedCollaborationAnalytics = collaborationAnalyticsData as any
export const seedModerationQueue = moderationQueueData as any[]
export const seedModerationRules = moderationRulesData as any[]
export const seedModerators = moderatorsData as any[]
export const seedModerationAnalytics = moderationAnalyticsData as any
export const seedFraudRiskMonitoring = fraudRiskMonitoringData as any
export const seedFraudModels = fraudModelsData as any[]
export const seedFraudResponses = fraudResponsesData as any[]
export const seedFraudThresholds = fraudThresholdsData as any[]
export const seedWesAnalytics = wesAnalyticsData as any
export const seedWesScores = wesScoresData as any[]
export const seedWesRecommendations = wesRecommendationsData as any[]
export const seedWesExecutions = wesExecutionsData as any[]
export const seedWesBottlenecks = wesBottlenecksData as any[]
export const seedWesKpis = wesKpisData as any[]
export const seedPlatformAnalytics = platformAnalyticsData as any
export const seedTenantAnalytics = tenantAnalyticsData as any[]
export const seedAnalyticsReports = analyticsReportsData as any[]
export const seedRevenueAnalytics = revenueAnalyticsData as any
export const seedTaxConfig = taxConfigData as any
export const seedGstConfig = gstConfigData as any
export const seedTaxReports = taxReportsData as any[]
export const seedPaymentGateways = paymentGatewaysData as any[]
export const seedPaymentAnalytics = paymentAnalyticsData as any
export const seedNotificationTemplates = notificationTemplatesData as any[]
export const seedNotificationScheduled = notificationScheduledData as any[]
export const seedNotificationDelivery = notificationDeliveryData as any[]
export const seedNotificationAnalytics = notificationAnalyticsData as any
export const seedBackupConfig = backupConfigData as any
export const seedBackupJobs = backupJobsData as any[]
export const seedBackupVerification = backupVerificationData as any[]

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
  apiUsage: seedApiUsage,
  apiRateLimits: seedApiRateLimits,
  apiVersions: seedApiVersions,
  webhooks: seedWebhooks,
  deployments: seedDeployments,
  maintenanceWindows: seedMaintenanceWindows,
  retentionPolicies: seedRetentionPolicies,
  legalHolds: seedLegalHolds,
  dsrRequests: seedDsrRequests,
  partners: seedPartners,
})

