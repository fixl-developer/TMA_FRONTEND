# Design Document

## Overview

This design outlines the implementation of all missing SuperAdmin pages for the TalentOS platform. The solution creates a complete, navigable SuperAdmin interface where every sidebar navigation item leads to a functional page with appropriate placeholder content and structure. The design follows the existing Microsoft 365 admin center pattern established in the codebase, ensuring visual and structural consistency across all pages.

### Current State

The SuperAdmin interface has:
- A fully functional SuperAdminShell with hierarchical sidebar navigation
- Several implemented pages with full functionality (tenants, users, pageants, workflows, templates, etc.)
- Many navigation items that lack corresponding page.tsx files
- Established patterns for PageLayout, PageHeader, PageSection, and MetricsGrid components

### Implementation Scope

This feature will create 52 new page.tsx files across 15 navigation sections:
- Tenant Management: 3 pages (lifecycle, configuration, risk)
- User Management: 3 pages (identity, roles, abuse)
- Feature Management: 3 pages (flags, rollouts, config)
- Revenue Management: 3 pages (billing, fees, reports)
- Payment Management: 3 pages (wallets, escrow, risk)
- Trust & Safety: 3 pages (disputes, enforcement, appeals)
- Moderation: 5 pages (queue, rules, appeals, moderators, analytics) - ALREADY IMPLEMENTED
- Automation: 3 pages (workflows, policies, controls)
- Security: 3 pages (threats, compliance, incidents)
- Analytics: 4 pages (platform, tenants, revenue, reports)
- Integrations: 3 pages (api/usage, webhooks, payments)
- Operations: 3 pages (infra, deployments, maintenance)
- Compliance: 5 pages (dsr, legal-holds, retention/policies, retention/schedules, retention/lifecycle)
- Collaboration: 5 pages (requests, rooms, contracts, escrow, analytics)
- Blueprints: 3 pages (catalog, assign, [id])

Note: Moderation pages are already fully implemented and should not be recreated.

### Design Goals

The implementation focuses on creating minimal, functional page components that:
- Use the existing SuperAdmin_Shell layout
- Follow the established PageLayout, PageHeader, and PageSection component patterns
- Display appropriate placeholder content with MetricsGrid components
- Maintain consistent styling with the Microsoft 365 admin center color scheme
- Support future enhancement with seed data integration
- Provide clear indication of intended functionality for each page

## Architecture

The architecture follows Next.js 13+ App Router conventions with a client-side rendering approach for all SuperAdmin pages. Each page is a standalone React component that integrates with the existing layout system.

### Design Principles

1. **Consistency**: All pages follow the same component structure and styling patterns
2. **Reusability**: Leverage shared components (PageLayout, PageHeader, PageSection, MetricsGrid, Card)
3. **Maintainability**: Clear separation between layout, content, and data
4. **Extensibility**: Placeholder pages designed for easy enhancement with real functionality
5. **Performance**: Client-side rendering for interactive admin interfaces
6. **Microsoft 365 Pattern**: Clean, professional aesthetic with subtle borders, ample whitespace, and clear hierarchy

### Microsoft 365 Admin Center Design Pattern

The design follows key principles from Microsoft 365 admin center:

**Visual Hierarchy**:
- Clear page headers with title, description, and category badge
- Metrics displayed prominently at the top of pages
- Content organized in clean, bordered cards
- Consistent spacing and alignment

**Color Usage**:
- Primary blue (#0078d4) for interactive elements and key metrics
- Neutral grays for text and borders
- Semantic colors for status (green for success, amber for warning, red for error)
- Light backgrounds (#f5f5f5, #faf9f8) for subtle contrast

**Typography**:
- Clear hierarchy with consistent font sizes
- Primary text: #323130 (dark gray, not pure black)
- Secondary text: #605e5c (medium gray for descriptions)
- Font weights: semibold for headings, regular for body text

**Spacing and Layout**:
- Generous padding and margins for breathing room
- Consistent gap spacing (gap-4 = 1rem)
- Responsive grids that adapt to screen size
- Max-width container (1600px) for optimal readability

### Component Hierarchy

```
SuperAdminShell (existing)
└── PageLayout
    ├── PageHeader
    │   ├── Title
    │   ├── Description
    │   ├── Badge
    │   └── Actions (optional)
    └── PageSection(s)
        ├── MetricsGrid (optional)
        │   └── Card(s) - Metric cards
        └── Card(s) - Content cards
            ├── CardHeader
            │   └── CardTitle
            └── CardContent
```

### Routing Structure

All pages follow Next.js file-based routing:
- `/app/{section}/page.tsx` - Section overview pages (e.g., /tenants/page.tsx)
- `/app/{section}/{subsection}/page.tsx` - Subsection pages (e.g., /tenants/lifecycle/page.tsx)
- `/app/{section}/{subsection}/{detail}/page.tsx` - Detail pages (e.g., /compliance/retention/policies/page.tsx)
- `/app/{section}/[id]/page.tsx` - Dynamic route pages (e.g., /blueprints/[id]/page.tsx)

### File Organization

```
frontend-superadmin/app/
├── tenants/
│   ├── page.tsx (overview - already exists)
│   ├── lifecycle/page.tsx (new)
│   ├── configuration/page.tsx (new)
│   └── risk/page.tsx (new)
├── users/
│   ├── page.tsx (overview - already exists)
│   ├── identity/page.tsx (new)
│   ├── roles/page.tsx (new)
│   └── abuse/page.tsx (new)
├── features/
│   ├── page.tsx (overview - already exists)
│   ├── flags/page.tsx (new)
│   ├── rollouts/page.tsx (new)
│   └── config/page.tsx (new)
└── [other sections following same pattern]
```

### Integration Points

- **SuperAdminShell**: Existing layout component that provides sidebar navigation
- **Shared Components**: PageLayout, PageHeader, PageSection, MetricsGrid from @/shared/components/layout/PageLayout
- **UI Components**: Card, Button, Input from @/shared/components/ui
- **Icons**: lucide-react for all iconography
- **Seed Data**: JSON files in data/seed/ for development and testing

## Components and Interfaces

### Page Component Pattern

Each page component follows this standardized structure:

```typescript
"use client"

import { Icon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"

export default function PageName() {
  return (
    <PageLayout>
      <PageHeader
        title="Page Title"
        description="Page description explaining the purpose and functionality."
        badge={
          <span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]">
            <Icon className="h-3.5 w-3.5 text-[#0078d4]" />
            Category
          </span>
        }
      />

      <PageSection title="Overview">
        <MetricsGrid>
          {/* Metric cards */}
        </MetricsGrid>
      </PageSection>

      <PageSection title="Details">
        <Card>
          <CardHeader>
            <CardTitle>Section Title</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Content */}
          </CardContent>
        </Card>
      </PageSection>
    </PageLayout>
  )
}
```

### Shared Components

The design leverages existing shared components from the codebase:

1. **PageLayout**: Provides consistent page structure with max-width container, padding, and background color
   - Props: `children`, `className` (optional)
   - Applies #f5f5f5 background color
   - Centers content with max-width of 1600px

2. **PageHeader**: Displays page title, description, badge, and optional action buttons
   - Props: `title`, `description` (optional), `badge` (optional), `actions` (optional), `className` (optional)
   - Responsive layout that stacks on mobile
   - Consistent typography and spacing

3. **PageSection**: Groups related content with optional title and description
   - Props: `title` (optional), `description` (optional), `children`, `className` (optional)
   - Provides consistent spacing between sections
   - Supports nested content organization

4. **MetricsGrid**: Responsive grid for displaying key metrics
   - Props: `children`, `className` (optional)
   - 2 columns on mobile, 4 columns on desktop
   - Consistent gap spacing

5. **Card/CardHeader/CardTitle/CardContent**: Container components for content sections
   - Standard shadcn/ui card components
   - Consistent border, background, and padding
   - Supports nested content

### Icon Selection Guide

Each page category uses specific icons from lucide-react for visual consistency:

| Category | Icon | Usage |
|----------|------|-------|
| Tenant Management | Building2 | All tenant-related pages |
| User Management | UserCircle2 | All user-related pages |
| Feature Management | Flag | Feature flags and rollouts |
| Revenue | TrendingUp | Billing, fees, reports |
| Payments | Wallet2 | Wallets, escrow, payment risk |
| Trust & Safety | ShieldAlert | Disputes, enforcement, appeals |
| Moderation | Shield | Content moderation pages |
| Security | ShieldCheck | Threats, compliance, incidents |
| Automation | Zap | Workflows, policies, controls |
| Analytics | BarChart3 | All analytics pages |
| Integrations | Plug2 | API, webhooks, payment integrations |
| Operations | Workflow | Infrastructure, deployments, maintenance |
| Compliance | FileCheck | DSR, legal holds, retention |
| Collaboration | Users | Requests, rooms, contracts |
| Blueprints | Layers | Catalog, assignment, details |

### Badge Component Pattern

Each page includes a badge in the PageHeader that indicates the page category:

```typescript
<span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]">
  <Icon className="h-3.5 w-3.5 text-[#0078d4]" />
  Category Name
</span>
```

Common category names:
- "Organization" - Tenant and user management
- "Platform" - Features, automation, operations
- "Finance" - Revenue and payments
- "Security" - Trust & safety, moderation, security
- "Analytics" - All analytics pages
- "Integration" - API and webhook pages
- "Compliance" - Legal and compliance pages
- "Collaboration" - Collaboration features
- "Configuration" - Blueprint and template pages

## Data Models

### Page Component Props

```typescript
interface PageComponentProps {
  // Most pages don't require props as they fetch their own data
  // Dynamic route pages receive params from Next.js
}

interface DynamicPageProps {
  params: {
    id: string
  }
}
```

### Metric Card Data

```typescript
interface MetricData {
  title: string
  value: string | number
  description: string
  color?: string // Optional color for the value (e.g., #107c10 for positive metrics)
  trend?: {
    value: number
    direction: 'up' | 'down'
    label: string
  }
}
```

### Placeholder Content Structure

```typescript
interface PlaceholderContent {
  sections: PlaceholderSection[]
}

interface PlaceholderSection {
  title: string
  description?: string
  metrics?: MetricData[]
  content?: string | React.ReactNode
  cards?: PlaceholderCard[]
}

interface PlaceholderCard {
  title: string
  content: string
  icon?: React.ComponentType
}
```

### Page Metadata

```typescript
interface PageMetadata {
  title: string
  description: string
  category: string
  icon: React.ComponentType
  route: string
  requiresData?: boolean // Whether page needs seed data
  status: 'implemented' | 'placeholder' | 'planned'
}
```

### Color Scheme Constants

```typescript
const COLORS = {
  // Primary colors
  primary: '#0078d4',
  background: '#f5f5f5',
  
  // Text colors
  textPrimary: '#323130',
  textSecondary: '#605e5c',
  
  // Border colors
  borderLight: '#edebe9',
  borderMedium: '#d1d1d1',
  
  // Card backgrounds
  cardBackground: '#faf9f8',
  cardBackgroundAlt: '#f3f2f1',
  
  // Semantic colors
  success: '#107c10',
  warning: '#ffb900',
  error: '#d13438',
  info: '#e3f2fd',
} as const
```

### Navigation Structure

```typescript
interface NavigationItem {
  label: string
  href: string
  icon?: React.ComponentType
  children?: NavigationItem[]
}

interface NavigationSection {
  title: string
  items: NavigationItem[]
}
```

## Implementation Patterns

### Pages to Create

Based on the requirements, the following pages need to be created:

**Tenant Management** (3 pages):
- `/tenants/lifecycle/page.tsx` - Tenant creation, activation, suspension, termination
- `/tenants/configuration/page.tsx` - Tenant plans, limits, feature flags
- `/tenants/risk/page.tsx` - Risk flags, fraud signals, holds

**User Management** (3 pages):
- `/users/identity/page.tsx` - Cross-tenant user identity management
- `/users/roles/page.tsx` - Platform-level role assignment
- `/users/abuse/page.tsx` - User suspensions, bans, appeals

**Feature Management** (3 pages):
- `/features/flags/page.tsx` - Feature flag management
- `/features/rollouts/page.tsx` - Gradual feature rollout configuration
- `/features/config/page.tsx` - Global platform configuration

**Revenue Management** (3 pages):
- `/revenue/billing/page.tsx` - Subscription management
- `/revenue/fees/page.tsx` - Platform fee configuration
- `/revenue/reports/page.tsx` - Revenue reports and exports

**Payment Management** (3 pages):
- `/payments/wallets/page.tsx` - Platform wallet overview
- `/payments/escrow/page.tsx` - Escrow status and holds
- `/payments/risk/page.tsx` - Payment risk flags

**Trust & Safety** (3 pages):
- `/trust-safety/disputes/page.tsx` - Cross-tenant dispute queue
- `/trust-safety/enforcement/page.tsx` - Enforcement actions and suspensions
- `/trust-safety/appeals/page.tsx` - Appeal workflows

**Moderation** (5 pages):
- `/moderation/queue/page.tsx` - Content review queue
- `/moderation/rules/page.tsx` - Moderation rules management
- `/moderation/appeals/page.tsx` - Moderation appeal handling
- `/moderation/moderators/page.tsx` - Moderator management
- `/moderation/analytics/page.tsx` - Moderation analytics

**Automation** (3 pages):
- `/automation/workflows/page.tsx` - Platform automation workflows
- `/automation/policies/page.tsx` - Automation policy configuration
- `/automation/controls/page.tsx` - Automation guardrails and limits

**Security** (3 pages):
- `/security/threats/page.tsx` - Threat dashboard
- `/security/compliance/page.tsx` - SOC 2 and ISO 27001 compliance mapping
- `/security/incidents/page.tsx` - P0/P1 incident view

**Analytics** (4 pages):
- `/analytics/platform/page.tsx` - Platform-wide analytics
- `/analytics/tenants/page.tsx` - Tenant-specific analytics
- `/analytics/revenue/page.tsx` - Revenue analytics
- `/analytics/reports/page.tsx` - Analytics reports and exports

**Integrations** (3 pages):
- `/integrations/api/usage/page.tsx` - API usage monitoring
- `/integrations/webhooks/page.tsx` - Webhook configuration
- `/integrations/payments/page.tsx` - Payment integration management

**Operations** (3 pages):
- `/operations/infra/page.tsx` - Infrastructure health and deployments
- `/operations/deployments/page.tsx` - Release management
- `/operations/maintenance/page.tsx` - Maintenance window management

**Compliance** (5 pages):
- `/compliance/dsr/page.tsx` - Data subject request management
- `/compliance/legal-holds/page.tsx` - Legal hold management
- `/compliance/retention/policies/page.tsx` - Retention policy management
- `/compliance/retention/schedules/page.tsx` - Retention schedule configuration
- `/compliance/retention/lifecycle/page.tsx` - Data lifecycle management

**Collaboration** (5 pages):
- `/collaboration/requests/page.tsx` - Collaboration request management
- `/collaboration/rooms/page.tsx` - Collaboration room monitoring
- `/collaboration/contracts/page.tsx` - Contract management
- `/collaboration/escrow/page.tsx` - Escrow monitoring
- `/collaboration/analytics/page.tsx` - Collaboration analytics

**Blueprints** (3 pages):
- `/blueprints/catalog/page.tsx` - Blueprint catalog view
- `/blueprints/assign/page.tsx` - Blueprint assignment to tenants
- `/blueprints/[id]/page.tsx` - Blueprint detail view (dynamic route)

**Total: 52 new pages**

### Placeholder Page Pattern

All new pages follow a consistent placeholder pattern that:
1. Uses the standard page component structure
2. Includes descriptive content about intended functionality
3. Displays relevant metric placeholders using MetricsGrid
4. Indicates the page is using seed data or is pending full implementation
5. Maintains visual consistency with existing pages

Example placeholder page:

```typescript
"use client"

import { Building2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"

export default function TenantLifecyclePage() {
  return (
    <PageLayout>
      <PageHeader
        title="Tenant Lifecycle"
        description="Manage tenant creation, activation, suspension, and termination workflows. This page will provide tools for managing the complete tenant lifecycle from onboarding through offboarding."
        badge={
          <span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]">
            <Building2 className="h-3.5 w-3.5 text-[#0078d4]" />
            Organization
          </span>
        }
      />

      <PageSection title="Overview">
        <MetricsGrid>
          <Card>
            <CardHeader>
              <CardTitle>Pending approvals</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-[#0078d4]">—</p>
              <p className="mt-1 text-xs text-[#605e5c]">
                Tenants awaiting activation
              </p>
            </CardContent>
          </Card>
          {/* Additional metric cards */}
        </MetricsGrid>
      </PageSection>

      <PageSection title="Lifecycle Management">
        <Card>
          <CardHeader>
            <CardTitle>Tenant lifecycle tools</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[#605e5c]">
              Full lifecycle management tools coming soon. This will include tenant creation workflows, 
              activation approvals, suspension management, and termination processes.
            </p>
          </CardContent>
        </Card>
      </PageSection>
    </PageLayout>
  )
}
```

### Metric Card Pattern

Metric cards follow a consistent structure:

```typescript
<Card>
  <CardHeader>
    <CardTitle>Metric Name</CardTitle>
  </CardHeader>
  <CardContent>
    <p className="text-3xl font-semibold text-[#323130]">
      {value}
    </p>
    <p className="mt-1 text-xs text-[#605e5c]">
      Description or context
    </p>
  </CardContent>
</Card>
```

Color coding for metric values:
- Default: `text-[#323130]` (primary text)
- Success/Active: `text-[#107c10]` (green)
- Warning/Pending: `text-[#0078d4]` (blue) or `text-[#ffb900]` (amber)
- Error/Suspended: `text-[#d13438]` (red)

### Content Card Pattern

Content cards provide detailed information:

```typescript
<Card>
  <CardHeader>
    <CardTitle>Section Title</CardTitle>
  </CardHeader>
  <CardContent>
    <p className="text-sm text-[#605e5c]">
      Descriptive content about this section. Can include multiple paragraphs,
      lists, or other formatted content.
    </p>
  </CardContent>
</Card>
```

### Responsive Grid Patterns

For side-by-side content on larger screens:

```typescript
// Two-column layout
<div className="grid gap-4 lg:grid-cols-2">
  <Card>...</Card>
  <Card>...</Card>
</div>

// Three-column layout
<div className="grid gap-4 lg:grid-cols-3">
  <Card>...</Card>
  <Card>...</Card>
  <Card>...</Card>
</div>

// Custom ratio layout
<div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
  <Card>...</Card>
  <Card>...</Card>
</div>
```

### Page Content Guidelines by Category

**Management Pages** (Tenant, User, Feature, Revenue, Payment):
- Overview section with 3-5 metric cards showing key statistics
- Management tools section with action cards
- Recent activity or status section
- Clear indication of what actions will be available

**Monitoring Pages** (Trust & Safety, Security, Analytics):
- Dashboard-style layout with metrics at the top
- Visualization cards (charts, graphs) in the middle
- Recent events or alerts section at the bottom
- Filters and time range selectors where appropriate

**Configuration Pages** (Automation, Integrations, Operations):
- Current configuration overview with metrics
- Configuration options section with cards for each setting area
- Status indicators for active configurations
- Links to related configuration pages

**Compliance Pages** (Compliance, Legal):
- Compliance status overview with metrics
- Policy or requirement cards
- Audit trail or history section
- Export and reporting options

**Collaboration Pages**:
- Activity overview with metrics
- Active items list (requests, rooms, contracts)
- Analytics or insights section
- Management actions section

### Accessibility and Best Practices

**Semantic HTML**:
- Use semantic elements (main, header, section, article)
- Proper heading hierarchy (h1 for page title, h2 for sections)
- Descriptive alt text for icons (handled by lucide-react)

**Keyboard Navigation**:
- All interactive elements should be keyboard accessible
- Proper focus management for modals and sheets
- Tab order follows visual layout

**Screen Reader Support**:
- Descriptive labels for all form inputs
- ARIA labels for icon-only buttons
- Status messages announced appropriately

**Color Contrast**:
- All text meets WCAG AA standards for contrast
- Primary text (#323130) on light backgrounds has sufficient contrast
- Interactive elements (#0078d4) are clearly distinguishable

**Responsive Design**:
- Mobile-first approach with progressive enhancement
- Grids collapse to single column on small screens
- Touch-friendly target sizes for interactive elements
- Sidebar collapses to hamburger menu on mobile

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: All navigation routes have corresponding pages

*For any* navigation item defined in SuperAdminShell with an href property, there should exist a corresponding page.tsx file at that route path that renders without errors.

**Validates: Requirements 19.1, 19.4**

### Property 2: All pages use PageLayout wrapper

*For any* SuperAdmin page component, it should be wrapped in the PageLayout component which is rendered within the SuperAdmin_Shell layout.

**Validates: Requirements 1.4, 2.4, 3.4, 4.4, 5.4, 6.4, 7.6, 8.4, 9.4, 10.5, 11.4, 12.4, 13.6, 14.6, 15.4, 17.2**

### Property 3: All pages have PageHeader with required props

*For any* SuperAdmin page component, it should contain a PageHeader component with title, description, and badge properties defined.

**Validates: Requirements 1.5, 2.5, 3.5, 4.5, 5.5, 6.5, 7.7, 8.5, 9.5, 10.6, 11.5, 12.5, 13.7, 14.7, 15.5, 17.3, 18.4**

### Property 4: Consistent color scheme across all pages

*For any* SuperAdmin page component, all color values used should match the Microsoft 365 admin center color scheme (#0078d4, #f5f5f5, #323130, #605e5c, #edebe9, #d1d1d1, #faf9f8, #f3f2f1, and semantic colors).

**Validates: Requirements 16.1, 16.2, 16.3, 16.4, 16.5, 16.6, 16.7**

### Property 5: Client-side rendering directive present

*For any* SuperAdmin page component file, it should include the "use client" directive at the top of the file.

**Validates: Requirements 17.1**

### Property 6: Pages use PageSection for content organization

*For any* SuperAdmin page component, it should organize content using at least one PageSection component.

**Validates: Requirements 17.4**

### Property 7: Pages use Card components for content grouping

*For any* SuperAdmin page component, it should use Card components to group related information.

**Validates: Requirements 17.5**

### Property 8: Icons imported from lucide-react

*For any* SuperAdmin page component that uses icons, all icon imports should come from the lucide-react package.

**Validates: Requirements 17.6**

### Property 9: Placeholder pages have complete structure

*For any* placeholder page, it should include descriptive text about intended functionality, use MetricsGrid for metrics, and indicate seed data usage or pending implementation status.

**Validates: Requirements 18.1, 18.2, 18.3**

## Error Handling

### Missing Route Handling

- Next.js automatically handles 404 errors for undefined routes
- All defined navigation routes will have corresponding page.tsx files
- No custom 404 handling needed at the page level
- SuperAdminShell layout provides consistent error boundaries

### Component Rendering Errors

- React error boundaries at the layout level catch rendering errors
- Individual page errors won't crash the entire application
- Error boundaries should display user-friendly error messages
- Console logging for development debugging
- Production errors should be logged to monitoring service

### Import Errors

- All imports use absolute paths with @ alias for consistency
- TypeScript compilation catches missing imports at build time
- Shared components are verified to exist before implementation
- Missing component imports will fail at compile time, not runtime

### Data Loading Errors

- Pages that fetch data should handle loading states gracefully
- Empty states should provide clear messaging about missing data
- Error states should display actionable error messages
- Seed data errors should not crash the page

### Navigation Errors

- Invalid routes are handled by Next.js 404 page
- Broken navigation links are caught by property tests
- Sidebar navigation state is managed by SuperAdminShell
- Route transitions should be smooth without errors

### Graceful Degradation

- Pages should render basic structure even if data fails to load
- Placeholder content should always be visible
- Icons should have fallback if lucide-react fails to load
- Layout should remain stable regardless of content errors

## Testing Strategy

### Dual Testing Approach

This feature requires both unit tests and property-based tests for comprehensive coverage:

- **Unit tests**: Verify specific page examples, navigation integration, and UI behavior
- **Property tests**: Verify universal properties across all SuperAdmin pages

Both testing approaches are complementary and necessary. Unit tests catch concrete bugs in specific pages, while property tests verify that all pages follow the required patterns.

### Unit Testing

Unit tests will focus on:
- Specific page examples (e.g., /tenants/lifecycle renders correctly)
- Navigation integration (sidebar highlighting, route transitions)
- Edge cases (missing data, error states)
- UI interactions (button clicks, form submissions)

Example unit test structure:
```typescript
describe('TenantLifecyclePage', () => {
  it('renders without errors', () => {
    render(<TenantLifecyclePage />)
  })
  
  it('displays correct page header', () => {
    render(<TenantLifecyclePage />)
    expect(screen.getByText('Tenant Lifecycle')).toBeInTheDocument()
  })
  
  it('includes appropriate badge', () => {
    render(<TenantLifecyclePage />)
    expect(screen.getByText('Organization')).toBeInTheDocument()
  })
  
  it('navigates correctly from sidebar', () => {
    render(<SuperAdminShell />)
    fireEvent.click(screen.getByText('Lifecycle'))
    expect(window.location.pathname).toBe('/tenants/lifecycle')
  })
})
```

### Property-Based Testing

Property-based tests will use fast-check library for TypeScript to validate universal properties across all pages. Each test MUST run a minimum of 100 iterations. Each property test MUST reference its corresponding design document property using the tag format shown below.

**Property Test 1: Navigation Route Coverage**
```typescript
// Feature: superadmin-pages-implementation, Property 1: All navigation routes have corresponding pages
// For any navigation item with href, corresponding page.tsx should exist

test('all navigation routes have corresponding pages', () => {
  fc.assert(
    fc.property(
      fc.constantFrom(...extractNavigationHrefs(navSections)),
      (href) => {
        const pagePath = `frontend-superadmin/app${href === '/' ? '' : href}/page.tsx`
        return fs.existsSync(pagePath)
      }
    ),
    { numRuns: 100 }
  )
})
```

**Property Test 2: PageLayout Wrapper**
```typescript
// Feature: superadmin-pages-implementation, Property 2: All pages use PageLayout wrapper
// For any SuperAdmin page, it should contain PageLayout component

test('all pages use PageLayout component', () => {
  fc.assert(
    fc.property(
      fc.constantFrom(...getAllSuperAdminPagePaths()),
      (pagePath) => {
        const content = fs.readFileSync(pagePath, 'utf-8')
        return content.includes('<PageLayout')
      }
    ),
    { numRuns: 100 }
  )
})
```

**Property Test 3: PageHeader Presence**
```typescript
// Feature: superadmin-pages-implementation, Property 3: All pages have PageHeader with required props
// For any SuperAdmin page, it should contain PageHeader with title, description, and badge

test('all pages have PageHeader with required props', () => {
  fc.assert(
    fc.property(
      fc.constantFrom(...getAllSuperAdminPagePaths()),
      (pagePath) => {
        const content = fs.readFileSync(pagePath, 'utf-8')
        return content.includes('<PageHeader') && 
               content.includes('title=') && 
               content.includes('description=') &&
               content.includes('badge=')
      }
    ),
    { numRuns: 100 }
  )
})
```

**Property Test 4: Color Scheme Consistency**
```typescript
// Feature: superadmin-pages-implementation, Property 4: Consistent color scheme across all pages
// For any color value in SuperAdmin pages, it should match the defined color scheme

test('all pages use consistent color scheme', () => {
  const validColors = [
    '#0078d4', '#f5f5f5', '#323130', '#605e5c', 
    '#edebe9', '#d1d1d1', '#faf9f8', '#f3f2f1',
    '#107c10', '#ffb900', '#d13438', '#e3f2fd'
  ]
  
  fc.assert(
    fc.property(
      fc.constantFrom(...getAllSuperAdminPagePaths()),
      (pagePath) => {
        const content = fs.readFileSync(pagePath, 'utf-8')
        const colorMatches = content.match(/#[0-9a-f]{6}/gi) || []
        return colorMatches.every(color => 
          validColors.includes(color.toLowerCase())
        )
      }
    ),
    { numRuns: 100 }
  )
})
```

**Property Test 5: Client Directive**
```typescript
// Feature: superadmin-pages-implementation, Property 5: Client-side rendering directive present
// For any SuperAdmin page file, it should include "use client" directive

test('all pages include use client directive', () => {
  fc.assert(
    fc.property(
      fc.constantFrom(...getAllSuperAdminPagePaths()),
      (pagePath) => {
        const content = fs.readFileSync(pagePath, 'utf-8')
        return content.trim().startsWith('"use client"') || 
               content.trim().startsWith("'use client'")
      }
    ),
    { numRuns: 100 }
  )
})
```

**Property Test 6: PageSection Usage**
```typescript
// Feature: superadmin-pages-implementation, Property 6: Pages use PageSection for content organization
// For any SuperAdmin page, it should use at least one PageSection component

test('all pages use PageSection components', () => {
  fc.assert(
    fc.property(
      fc.constantFrom(...getAllSuperAdminPagePaths()),
      (pagePath) => {
        const content = fs.readFileSync(pagePath, 'utf-8')
        return content.includes('<PageSection')
      }
    ),
    { numRuns: 100 }
  )
})
```

**Property Test 7: Card Component Usage**
```typescript
// Feature: superadmin-pages-implementation, Property 7: Pages use Card components for content grouping
// For any SuperAdmin page, it should use Card components

test('all pages use Card components', () => {
  fc.assert(
    fc.property(
      fc.constantFrom(...getAllSuperAdminPagePaths()),
      (pagePath) => {
        const content = fs.readFileSync(pagePath, 'utf-8')
        return content.includes('<Card')
      }
    ),
    { numRuns: 100 }
  )
})
```

**Property Test 8: Lucide-React Icons**
```typescript
// Feature: superadmin-pages-implementation, Property 8: Icons imported from lucide-react
// For any SuperAdmin page with icons, all icon imports should be from lucide-react

test('all pages import icons from lucide-react', () => {
  fc.assert(
    fc.property(
      fc.constantFrom(...getAllSuperAdminPagePaths()),
      (pagePath) => {
        const content = fs.readFileSync(pagePath, 'utf-8')
        const hasIcons = /import\s+{[^}]*}\s+from\s+["']lucide-react["']/.test(content)
        const hasOtherIconImports = /import\s+{[^}]*Icon[^}]*}\s+from\s+["'](?!lucide-react)/.test(content)
        // If page has icons, they must be from lucide-react
        return !hasOtherIconImports
      }
    ),
    { numRuns: 100 }
  )
})
```

**Property Test 9: Placeholder Page Structure**
```typescript
// Feature: superadmin-pages-implementation, Property 9: Placeholder pages have complete structure
// For any placeholder page, it should have descriptive content, MetricsGrid, and seed data indication

test('placeholder pages have complete structure', () => {
  fc.assert(
    fc.property(
      fc.constantFrom(...getPlaceholderPagePaths()),
      (pagePath) => {
        const content = fs.readFileSync(pagePath, 'utf-8')
        const hasDescription = content.includes('description=')
        const hasMetricsGrid = content.includes('<MetricsGrid')
        const hasSeedDataMention = content.toLowerCase().includes('seed') || 
                                   content.toLowerCase().includes('placeholder') ||
                                   content.toLowerCase().includes('coming soon')
        return hasDescription && hasMetricsGrid && hasSeedDataMention
      }
    ),
    { numRuns: 100 }
  )
})
```

### Integration Testing

Integration tests will verify:
- Navigation flow between pages works correctly
- Sidebar highlighting updates when navigating to different pages
- Layout components render consistently across all pages
- No console errors when navigating between pages
- Sidebar expansion behavior for nested navigation groups

Example integration test:
```typescript
describe('SuperAdmin Navigation Integration', () => {
  it('highlights active page in sidebar', () => {
    render(<SuperAdminShell />)
    fireEvent.click(screen.getByText('Lifecycle'))
    expect(screen.getByText('Lifecycle').closest('a')).toHaveClass('active')
  })
  
  it('expands parent navigation for nested pages', () => {
    render(<SuperAdminShell />)
    fireEvent.click(screen.getByText('Retention Policies'))
    expect(screen.getByText('Compliance').closest('div')).toHaveAttribute('data-expanded', 'true')
  })
})
```

### Manual Testing Checklist

- [ ] Navigate to each page via sidebar and verify it renders
- [ ] Verify sidebar highlighting for each active page
- [ ] Check responsive behavior on different screen sizes
- [ ] Verify consistent styling across all pages
- [ ] Test collapsed sidebar state with all pages
- [ ] Verify all icons display correctly
- [ ] Check that placeholder content is clear and informative
- [ ] Test navigation between all page sections
- [ ] Verify no console errors during navigation
