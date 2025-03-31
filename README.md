# BCF

## Essense

This is a web app for perfumers. Users can browse IFRA’s FIG of 3100 perfume compounds, manage their collection of ingredients (what they have in the lab, for example), store, and create perfume formulas. If they wish, users can suggest a change to an ingredient, which makes BCF a perfume Wikipedia.

## Overview

- **Browse** through IFRA’s database of perfume compounds and contribute to BCF's knowledge base
- **Manage** a personal collection of ingredients and enrich it with subjective data, in markdown
- **Create** and store perfume formulas, accessible from anywhere with your credentials

## The Stack

### Backend

- **Rust** with **Axum** framework for a high-performance API
- **SQLx** for type-safe database interactions with PostgreSQL
- **JWT** authentication with role-based access control

### Frontend

- **Svelte/Typescript** with component-based architecture
- **TailwindCSS** for styling
- **Unsplash API** for dynamic photo fetching

### Infrastructure

- **Docker Compose** for containerization and deployment
- **PostgreSQL** for relational data storage
- **Redis** for caching

## Getting Started

### Prerequisites

- Docker Compose
- sqlx
- pnpm

### Environment Variables

See the .env.example in the axum/ and svelte/ directories

### Installation

1. Clone the repository
2. Set up environment variables
3. From the axum/ folder, run:
   ```
   sqlx database create && sqlx migrate run
   ```
4. Run with Docker Compose:
   ```
   docker compose -f compose.dev.yaml up -d
   ```

## License

This project is licensed under the GNU Affero General Public License v3.0 (AGPL-3.0).

This means:

- You can use, modify, and distribute this software
- If you modify and distribute it, you must make your modifications available under the same license
- If you run a modified version of the software on a server that users interact with (even over a network), you must make the source code available to those users

This ensures that all improvements to the code remain open source, while allowing the original creator to maintain certain commercial advantages.

For more information, see the [full license text](https://www.gnu.org/licenses/agpl-3.0.en.html).
