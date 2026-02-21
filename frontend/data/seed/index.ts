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
import castingsData from "./castings.json"
import contractsData from "./contracts.json"
import contractTemplatesData from "./contract_templates.json"
import clausesData from "./clauses.json"
import contractSignersData from "./contract_signers.json"
import registrationsData from "./registrations.json"
import judgesData from "./judges.json"
import sponsorsData from "./sponsors.json"
import campaignsData from "./campaigns.json"
import coursesData from "./courses.json"
import staffData from "./staff.json"
import usersData from "./users.json"
import abuseReportsData from "./abuseReports.json"
import featureFlagsData from "./featureFlags.json"
import rolloutsData from "./rollouts.json"
import platformConfigData from "./platformConfig.json"
import billingPlansData from "./billingPlans.json"
import revenueReportsData from "./revenueReports.json"
import revenueMovementsData from "./revenue_movements.json"
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
import pageantTemplatesData from "./pageantTemplates.json"
import pageantProcessesData from "./pageant_processes.json"
import pageantScoresData from "./pageant_scores.json"
import pageantResultsData from "./pageant_results.json"
import pageantLiveData from "./pageantLive.json"
import pageantAnalyticsData from "./pageantAnalytics.json"
import invoicesData from "./invoices.json"
import payoutsData from "./payouts.json"
import adCampaignsData from "./adCampaigns.json"
import adCreativesData from "./adCreatives.json"
import adTargetingData from "./adTargeting.json"
import adPerformanceData from "./adPerformance.json"
import adAttributionData from "./ad_attribution.json"
import rewardsData from "./rewards.json"
import loyaltyTiersData from "./loyaltyTiers.json"
import discountCodesData from "./discountCodes.json"
import activityLogsData from "./activityLogs.json"
import redeemableItemsData from "./redeemableItems.json"
import lessonsData from "./lessons.json"
import assessmentsData from "./assessments.json"
import certificatesData from "./certificates.json"
import sessionsData from "./sessions.json"
import enrollmentsData from "./enrollments.json"
import rolesData from "./roles.json"
import teamsData from "./teams.json"
import invitationsData from "./invitations.json"
import talentTagsData from "./talent_tags.json"
import talentAvailabilityData from "./talent_availability.json"
import assetsData from "./assets.json"
import castingSubmissionsData from "./casting_submissions.json"
import holdsData from "./holds.json"
import callSheetsData from "./call_sheets.json"
import ledgerEntriesData from "./ledger_entries.json"
import creditsAccountsData from "./credits_accounts.json"
import statementsData from "./statements.json"
import escrowsData from "./escrows.json"
import escrowEventsData from "./escrow_events.json"
import notificationsData from "./notifications.json"
import disputeEvidenceData from "./dispute_evidence.json"
import automationRunsData from "./automation_runs.json"
import automationCampaignsData from "./automation_campaigns.json"
import automationRulesData from "./automation_rules.json"
import policyPacksData from "./policy_packs.json"
import slaConfigsData from "./sla_configs.json"
import adminSettingsData from "./admin_settings.json"
import platformAuditLogsData from "./platform_audit_logs.json"
import subTenantLinksData from "./sub_tenant_links.json"
import contentReportsData from "./content_reports.json"
import groupMembersData from "./group_members.json"
import cohortsData from "./cohorts.json"
import campaignDeliverablesData from "./campaign_deliverables.json"
import campaignDealsData from "./campaign_deals.json"
import dealsData from "./deals.json"
import creatorsData from "./creators.json"
import supportCasesData from "./support_cases.json"
import userConsentsData from "./user_consents.json"
import paymentEventsData from "./payment_events.json"
import webhookEventsData from "./webhook_events.json"
import blueprintConfigsData from "./blueprint_configs.json"
import rolePacksData from "./role_packs.json"
import leadsData from "./leads.json"
import accountsData from "./accounts.json"
import contactsData from "./contacts.json"
import activitiesData from "./activities.json"
import segmentsData from "./segments.json"
import rateCardsData from "./rate_cards.json"
import quoteTemplatesData from "./quote_templates.json"
import quotesData from "./quotes.json"
import obligationsData from "./obligations.json"
import projectsData from "./projects.json"
import tasksData from "./tasks.json"
import checklistsData from "./checklists.json"
import runOfShowData from "./run_of_show.json"
import resourcesData from "./resources.json"
import availabilityBlocksData from "./availability_blocks.json"
import assignmentsData from "./assignments.json"
import conflictsData from "./conflicts.json"
import vendorsData from "./vendors.json"
import rfqsData from "./rfqs.json"
import purchaseOrdersData from "./purchase_orders.json"
import vendorScorecardsData from "./vendor_scorecards.json"
import goodsReceiptsData from "./goods_receipts.json"
import shipmentsData from "./shipments.json"
import packagesData from "./packages.json"
import trackingEventsData from "./tracking_events.json"
import returnAuthorizationsData from "./return_authorizations.json"
import threadsData from "./threads.json"
import messagesData from "./messages.json"
import approvalsData from "./approvals.json"
import userNotificationPreferencesData from "./user_notification_preferences.json"
import tenantMetricSnapshotsData from "./tenant_metric_snapshots.json"
import slaClocksData from "./sla_clocks.json"
import approvalMetricsData from "./approval_metrics.json"
import wesRecommendationsData from "./wes_recommendations.json"
import wesBottlenecksData from "./wes_bottlenecks.json"
import cccMetricsData from "./ccc_metrics.json"
import branchesData from "./branches.json"
import franchiseTemplatesData from "./franchise_templates.json"
import shiftsData from "./shifts.json"
import eventStaffingEventsData from "./event_staffing_events.json"
import marketplaceListingsData from "./marketplace_listings.json"

// Type assertions - keep simple for now
export const seedPageants = pageantsData as any[]
export const seedTenants = tenantsData as any[]
export const seedTalents = talentsData as any[]
export const seedBookings = bookingsData as any[]
export const seedCastings = castingsData as any[]
export const seedContracts = contractsData as any[]
export const seedContractTemplates = contractTemplatesData as any[]
export const seedClauses = clausesData as any[]
export const seedContractSigners = contractSignersData as any[]
export const seedRegistrations = registrationsData as any[]
export const seedJudges = judgesData as any[]
export const seedSponsors = sponsorsData as any[]
export const seedCampaigns = campaignsData as any[]
export const seedCourses = coursesData as any[]
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
export const seedRevenueMovements = revenueMovementsData as any[]
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
export const seedPageantTemplates = pageantTemplatesData as any[]
export const seedPageantProcesses = pageantProcessesData as any[]
export const seedPageantScores = pageantScoresData as any[]
export const seedPageantResults = pageantResultsData as any[]
export const seedPageantLive = pageantLiveData as Record<string, any>
export const seedPageantAnalytics = pageantAnalyticsData as Record<string, any>
export const seedInvoices = invoicesData as any[]
export const seedPayouts = payoutsData as any[]
export const seedAdCampaigns = adCampaignsData as any[]
export const seedAdCreatives = adCreativesData as any[]
export const seedAdTargeting = adTargetingData as any[]
export const seedAdPerformance = adPerformanceData as Record<string, any>
export const seedAdAttribution = adAttributionData as any[]
export const seedRewards = rewardsData as any[]
export const seedLoyaltyTiers = loyaltyTiersData as any[]
export const seedDiscountCodes = discountCodesData as any[]
export const seedActivityLogs = activityLogsData as any[]
export const seedRedeemableItems = redeemableItemsData as any[]
export const seedLessons = lessonsData as any[]
export const seedAssessments = assessmentsData as any[]
export const seedCertificates = certificatesData as any[]
export const seedSessions = sessionsData as any[]
export const seedEnrollments = enrollmentsData as any[]
export const seedRoles = rolesData as any[]
export const seedTeams = teamsData as any[]
export const seedInvitations = invitationsData as any[]
export const seedTalentTags = talentTagsData as any[]
export const seedTalentAvailability = talentAvailabilityData as any[]
export const seedAssets = assetsData as any[]
export const seedCastingSubmissions = castingSubmissionsData as any[]
export const seedHolds = holdsData as any[]
export const seedCallSheets = callSheetsData as any[]
export const seedLedgerEntries = ledgerEntriesData as any[]
export const seedCreditsAccounts = creditsAccountsData as any[]
export const seedStatements = statementsData as any[]
export const seedEscrows = escrowsData as any[]
export const seedEscrowEvents = escrowEventsData as any[]
export const seedNotifications = notificationsData as any[]
export const seedDisputeEvidence = disputeEvidenceData as any[]
export const seedAutomationRuns = automationRunsData as any[]
export const seedAutomationCampaigns = automationCampaignsData as any[]
export const seedAutomationRules = automationRulesData as any[]
export const seedPolicyPacks = policyPacksData as any[]
export const seedSlaConfigs = slaConfigsData as any[]
export const seedAdminSettings = adminSettingsData as any
export const seedPlatformAuditLogs = platformAuditLogsData as any
export const seedSubTenantLinks = subTenantLinksData as any[]
export const seedContentReports = contentReportsData as any[]
export const seedGroupMembers = groupMembersData as any[]
export const seedCohorts = cohortsData as any[]
export const seedCampaignDeliverables = campaignDeliverablesData as any[]
export const seedCampaignDeals = campaignDealsData as any[]
export const seedDeals = dealsData as any[]
export const seedCreators = creatorsData as any[]
export const seedSupportCases = supportCasesData as any[]
export const seedUserConsents = userConsentsData as any[]
export const seedPaymentEvents = paymentEventsData as any[]
export const seedWebhookEvents = webhookEventsData as any[]
export const seedBlueprintConfigs = blueprintConfigsData as any[]
export const seedRolePacks = rolePacksData as any[]
export const seedLeads = leadsData as any[]
export const seedAccounts = accountsData as any[]
export const seedContacts = contactsData as any[]
export const seedActivities = activitiesData as any[]
export const seedSegments = segmentsData as any[]
export const seedRateCards = rateCardsData as any[]
export const seedQuoteTemplates = quoteTemplatesData as any[]
export const seedQuotes = quotesData as any[]
export const seedObligations = obligationsData as any[]
export const seedProjects = projectsData as any[]
export const seedTasks = tasksData as any[]
export const seedChecklists = checklistsData as any[]
export const seedRunOfShow = runOfShowData as any[]
export const seedResources = resourcesData as any[]
export const seedAvailabilityBlocks = availabilityBlocksData as any[]
export const seedAssignments = assignmentsData as any[]
export const seedConflicts = conflictsData as any[]
export const seedVendors = vendorsData as any[]
export const seedRfqs = rfqsData as any[]
export const seedPurchaseOrders = purchaseOrdersData as any[]
export const seedVendorScorecards = vendorScorecardsData as any[]
export const seedGoodsReceipts = goodsReceiptsData as any[]
export const seedShipments = shipmentsData as any[]
export const seedPackages = packagesData as any[]
export const seedTrackingEvents = trackingEventsData as any[]
export const seedReturnAuthorizations = returnAuthorizationsData as any[]
export const seedThreads = threadsData as any[]
export const seedMessages = messagesData as any[]
export const seedApprovals = approvalsData as any[]
export const seedUserNotificationPreferences = userNotificationPreferencesData as any[]
export const seedTenantMetricSnapshots = tenantMetricSnapshotsData as any[]
export const seedSlaClocks = slaClocksData as any[]
export const seedApprovalMetrics = approvalMetricsData as any[]
export const seedWesRecommendations = wesRecommendationsData as any[]
export const seedWesBottlenecks = wesBottlenecksData as any[]
export const seedCccMetrics = cccMetricsData as any[]
export const seedBranches = branchesData as any[]
export const seedFranchiseTemplates = franchiseTemplatesData as any[]
export const seedShifts = shiftsData as any[]
export const seedEventStaffingEvents = eventStaffingEventsData as any[]
export const seedMarketplaceListings = marketplaceListingsData as any[]

export const getAllSeedData = () => ({
  pageants: seedPageants,
  tenants: seedTenants,
  talents: seedTalents,
  bookings: seedBookings,
  castings: seedCastings,
  contracts: seedContracts,
  registrations: seedRegistrations,
  judges: seedJudges,
  sponsors: seedSponsors,
  campaigns: seedCampaigns,
  courses: seedCourses,
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
  userConsents: seedUserConsents,
  paymentEvents: seedPaymentEvents,
  webhookEvents: seedWebhookEvents,
  blueprintConfigs: seedBlueprintConfigs,
  rolePacks: seedRolePacks,
  partners: seedPartners,
})

