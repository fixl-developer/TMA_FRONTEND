# TalentOS Frontend Projects

This repository contains **two separate Next.js frontend applications** for the TalentOS platform:

## Project Structure

```
TMA-frontend/
├── frontend/                    # Tenant/User Frontend Application
│   ├── app/                     # Next.js App Router pages
│   ├── tenant/                  # Tenant-specific features
│   ├── shared/                  # Shared utilities, types, components
│   ├── store/                   # Redux store (auth, tenant state)
│   ├── data/                    # Seed data (JSON files)
│   └── components/              # UI components
│
└── frontend-superadmin/          # Super Admin Frontend Application
    ├── app/                     # Next.js App Router pages
    ├── superadmin/              # Super Admin-specific features
    └── shared/                  # Shared utilities, types, components
```

## Frontend Applications

### 1. `frontend/` - Tenant/User Frontend
**Purpose**: Main application for tenants (agencies, brands, talents) and end users.

**Features**:
- Talent Profile Management
- Brand Management
- Event Creation & Management
- Pageant Process Builder
- Campaign Management
- And all other tenant-facing features

**Tech Stack**:
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Redux Toolkit (for global auth/tenant state)
- React Hook Form + Zod (for forms)

**Getting Started**:
```bash
cd frontend
npm install
npm run dev
```

### 2. `frontend-superadmin/` - Super Admin Frontend
**Purpose**: Administrative dashboard for platform management.

**Features**:
- Tenant Management
- User Management
- Platform Configuration
- System Monitoring
- And all other super admin features

**Tech Stack**:
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Redux Toolkit (for global auth state)
- React Hook Form + Zod (for forms)

**Getting Started**:
```bash
cd frontend-superadmin
npm install
npm run dev
```

## Shared Code Strategy

Currently, each frontend project has its own `shared/` folder. For code that needs to be shared between both projects:

1. **Types & Interfaces**: Duplicate TypeScript types in both `shared/lib/types/` folders (or use a monorepo package in the future)
2. **UI Components**: Each project has its own `shared/components/ui/` folder
3. **Utilities**: Each project has its own `shared/lib/utils.ts`

**Future Consideration**: If significant code duplication occurs, consider:
- Creating a shared npm package
- Using a monorepo structure (e.g., Turborepo, Nx)
- Using symlinks (development only)

## Development Workflow

1. **Tenant Features**: Work in `frontend/` directory
2. **Super Admin Features**: Work in `frontend-superadmin/` directory
3. **Shared Types**: Update types in both projects' `shared/lib/types/` folders (or create a shared package)

## Architecture Principles

- **Feature-Based Structure**: Organize code by feature, not by type
- **Local State First**: Use React local state for component-specific logic
- **Redux for Global State**: Only use Redux for truly global state (auth, current tenant)
- **Mock Services**: Use seed data and mock services until backend is ready
- **Type Safety**: All TypeScript interfaces match backend schemas
- **Accessibility**: WCAG 2.1 AA compliance
- **Code Quality**: Comprehensive comments, error handling, and documentation

## Backend Integration

When backend APIs are ready:
1. Replace mock services in `shared/services/` with actual API calls
2. Update Redux slices to use real authentication endpoints
3. Add API client configuration (e.g., axios, fetch wrapper)
4. Update environment variables for API endpoints

## Documentation

- `docs.md`: Product Requirements Document (PRD)
- `backend.md`: Backend schema definitions (Mongoose models)

## Notes

- Both projects are **completely independent** Next.js applications
- Each has its own `package.json`, `tsconfig.json`, and dependencies
- Each can be deployed separately
- Shared code is currently duplicated (can be refactored to a package later)
