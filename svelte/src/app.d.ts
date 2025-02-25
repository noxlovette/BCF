// app.d.ts
import type { JWTPayload } from "jose";

declare global {
  namespace App {
    interface Locals {
      user: JWTPayload;
    }
    interface Window {
      turnstile: {
        render: (element: HTMLElement, options: any) => string;
        remove: (widgetId: string) => void;
        reset: (widgetId: string) => void;
      };
    }
  }
}

export {};
