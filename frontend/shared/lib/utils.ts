/**
 * Utility Functions - Super Admin
 *
 * Common utility functions used across the Super Admin application.
 */

import { type ClassValue, clsx } from "clsx"

/**
 * Merge class names using clsx
 *
 * @param inputs - Class names to merge
 * @returns Merged class string
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

/**
 * Format currency amount from minor units (paise/cents) to major units.
 * Intended for quick seed-driven finance views only.
 */
export function formatCurrency(
  amountMinor: number,
  currency: string = "INR"
): string {
  const major = amountMinor / 100
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(major)
}

