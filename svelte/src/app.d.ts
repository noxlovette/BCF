// app.d.ts
import type { User } from "$lib/types";

declare global {
  namespace App {
    interface Locals {
      user: User;
    }
  }
}

export {};
