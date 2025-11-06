# EcoConnect - Food Waste Reduction Platform

## Overview

EcoConnect is a web-based platform designed to reduce food wastage by connecting restaurants with NGOs and volunteers for surplus food redistribution. The application features a modern, responsive single-page design with sections for information presentation and community engagement through a contact form.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- **Framework**: React with TypeScript using Vite as the build tool
- **Routing**: Wouter for client-side routing
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens and CSS variables
- **State Management**: TanStack Query (React Query) for server state management
- **Form Handling**: React Hook Form with Zod validation via @hookform/resolvers

**Design Decisions:**
- Single-page application (SPA) architecture with smooth scrolling navigation between sections
- Component-based architecture with reusable UI components following shadcn/ui patterns
- Responsive design with mobile-first approach
- Custom color scheme focused on green (primary) and orange (secondary) to reflect sustainability theme
- Path aliases configured for clean imports (@/, @shared/, @assets/)

### Backend Architecture

**Technology Stack:**
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js for HTTP server
- **Database ORM**: Drizzle ORM configured for PostgreSQL
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **Validation**: Zod schemas shared between frontend and backend

**Design Decisions:**
- RESTful API design with a single contact form submission endpoint (`POST /api/contact`)
- In-memory storage implementation (MemStorage) as the current data layer, allowing easy migration to database-backed storage
- Shared schema definitions between client and server via `@shared/schema` for type safety
- Development and production build processes with separate configurations
- Request/response logging middleware for API debugging

**API Endpoints:**
- `POST /api/contact` - Contact form submission with validation

### Data Storage

**Database Schema:**
- **users table**: Basic user authentication structure (id, username, password) - currently unused in the application
- **contact_submissions table**: Stores contact form submissions (id, name, email, message, createdAt)

**Current Implementation:**
- In-memory storage using Map data structures for rapid prototyping
- UUID-based primary keys using `gen_random_uuid()` for PostgreSQL compatibility
- Drizzle ORM configuration points to PostgreSQL but storage interface allows for easy swapping

**Migration Path:**
- Schema defined in `shared/schema.ts` is production-ready for PostgreSQL
- Storage interface (`IStorage`) allows switching from `MemStorage` to database implementation without changing application logic
- Drizzle Kit configured for migrations with `npm run db:push` command

### External Dependencies

**Third-Party Services:**
- **Neon Database**: PostgreSQL database provider (configured but not actively used with in-memory fallback)
- **Unsplash**: Image hosting for hero and section backgrounds via CDN links
- **Font Awesome**: Icon library via CDN (referenced in components)
- **Google Fonts**: Custom fonts (Architects Daughter, DM Sans, Fira Code, Geist Mono) loaded via CDN

**Development Tools:**
- **Replit-specific plugins**: 
  - `@replit/vite-plugin-runtime-error-modal` for error handling
  - `@replit/vite-plugin-cartographer` for development mapping
  - `@replit/vite-plugin-dev-banner` for development banner
- **Build Tools**: esbuild for server bundling, Vite for client bundling

**Key Libraries:**
- **Radix UI**: Comprehensive set of accessible UI primitives for all interactive components
- **TanStack Query**: Server state management with automatic caching and refetching
- **date-fns**: Date manipulation and formatting
- **clsx & tailwind-merge**: Utility for conditional className management

**Session Management:**
- `connect-pg-simple` configured for PostgreSQL session storage (infrastructure ready but not implemented in current authentication flow)