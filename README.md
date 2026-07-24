# INFNOVA Internship Applicant Management Dashboard

This project is my solution for the INFNOVA Technologies Frontend Internship Challenge. It is a responsive admin dashboard that allows administrators to manage internship applicants through the provided REST API. While building this project, I focused on clean code, reusable components, good user experience, and responsive design.

## Live Demo

🌐 https://infnova-dashboard-xi.vercel.app/login

---


## Features

- Secure login and logout
- Session persistence with automatic expiration handling
- View applicants with pagination
- Search applicants by name or email
- Filter applicants by status
- Sort applicants by name, status, track, and application date
- View detailed applicant information
- Update applicant status
- Dashboard statistics showing total and status counts
- Responsive layout for desktop and mobile devices
- Dark mode with saved user preference
- Loading, empty, and error states

---

## Tech Stack

- **Next.js 14 (App Router)** for routing and application structure
- **TypeScript** for type safety
- **Tailwind CSS** for responsive styling
- **TanStack Query** for data fetching and caching
- **React Hook Form** with **Zod** for form validation
- **Zustand** for authentication state management
- **Axios** for communicating with the REST API
- **Radix UI** for accessible UI components

---

## Project Structure

```
app/
  (auth)/login/
  (dashboard)/
    applicants/[id]/

components/
  applicant/
  auth/
  dashboard/
  ui/

lib/
  api/
  hooks/
  store/
  types/
```

---

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm 9 or later

### Installation

```bash
git clone <repository-url>
cd infnova-dashboard
npm install --legacy-peer-deps
npm run dev
```

Open your browser and visit:

```
http://localhost:3000
```

### Demo Credentials

```
Email: admin@infnova.tech
Password: InternChallenge2026!
```

### Production Build

```bash
npm run build
npm start
```

### Deploy

The project can be deployed easily using Vercel.

```bash
npx vercel --prod
```

---

## Design Decisions

While developing this project, I made several decisions to keep the application simple and maintainable.

- Authentication is handled on the client using localStorage because the challenge focuses on frontend implementation.
- Search, filtering, sorting, and pagination are synchronized with URL parameters so users can refresh or share the current view.
- Axios interceptors automatically handle expired sessions by redirecting users to the login page.
- Theme preference is stored locally so the selected mode is remembered across visits.
- Components are organized by feature to make the project easier to navigate and maintain.

---

## Assumptions

- The login API returns an `accessToken`.
- Applicant status values are:
  - pending
  - shortlisted
  - accepted
  - rejected
- The application is designed for a single administrator.
- Pagination information is returned inside a `meta` object.

---

## Challenges

One challenge was keeping filters, search, sorting, and pagination synchronized without making the application difficult to manage. Using URL search parameters together with TanStack Query helped keep the state predictable and easy to share.

Another challenge was handling expired authentication sessions consistently across every page. I solved this by centralizing the logic inside an Axios response interceptor.

---

## What I Learned

Working on this project helped me improve my understanding of:

- Next.js App Router
- Managing server state with TanStack Query
- Creating reusable React components
- Authentication and protected routes
- TypeScript in larger React applications
- Building responsive interfaces with Tailwind CSS

---

## Future Improvements

If I continue developing this project, I would like to add:

- Optimistic UI updates
- More filtering options
- CSV export
- Page size selection
- Unit and integration tests using Vitest and React Testing Library
- Storybook for component documentation
- Route-level error boundaries
- Performance optimizations

---

## Author

**Firaol Assefa**

- GitHub: https://github.com/firaolassefa
- Portfolio: https://portfolio-firaolassefa.vercel.app/

---

Thank you for reviewing my submission. I enjoyed building this project and appreciated the opportunity to work on this challenge.