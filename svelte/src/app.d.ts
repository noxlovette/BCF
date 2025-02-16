// app.d.ts
import type { JWTPayload } from "jose";

declare global {
  namespace App {
    interface Locals {
      user: JWTPayload;
    }
  }
}

export {};
