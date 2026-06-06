# Project: Practicas Profesionalizantes - Happy Paws

This workspace contains the development of "Happy Paws" (also referred to as "Mi mascota y yo"), a pet management application. The project is focused on delivering a high-quality **Mobile Progressive Web App (PWA)**.

## Project Structure

- **`app/`**: Next.js App Router directory (Pages, Layouts, Components).
- **`public/`**: Static assets (icons, images, manifest.json).
- **`documents/`**: Planning materials and legacy prototypes.
  - `views/mi_mascota_y_yo_app.html`: High-fidelity mobile prototype.
  - `roadmap/`: Project planning documents.

## Technical Stack

- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **State/UI**: React 19
- **Target**: Mobile-first PWA

## Getting Started

### Development
```bash
npm install
npm run dev
```

### PWA Requirements
- [ ] Configure `manifest.json` in `public/`.
- [ ] Implement Service Workers (using `next-pwa` or similar).
- [ ] Ensure responsive mobile-only layout.

## Development Conventions

- **Mobile First**: All UI components must be optimized for mobile viewports (e.g., standard mobile widths, touch-friendly targets).
- **Styling**: Use Tailwind CSS 4. Adhere to the brown/cream palette from the prototypes.
- **TypeScript**: Mandatory for all new logic.
- **Component Architecture**: Prefer Server Components for data-heavy parts and Client Components for interactive UI elements.

## TODO / Roadmap
- [ ] Configure PWA metadata and icons.
- [ ] Migrate `mi_mascota_y_yo_app.html` designs to `app/page.tsx`.
- [ ] Implement core features:
    - Pet Profile Management.
    - Health Tracking & Reminders.
    - Integration with Gemini AI for pet care advice.
