import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge className dengan Tailwind (cn = className)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format tanggal ke Indonesia
 */
export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Format tanggal pendek (01/06/2025)
 */
export function formatDateShort(date: string | Date): string {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

/**
 * Debounce function (tunda eksekusi)
 */
export function debounce<T extends (...args: any[]) => void>(
  fn: T,
  delay: number
) {
  let timeoutId: ReturnType<<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Deep clone object
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Generate ID unik
 */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Capitalize first letter
 */
export function capitalize(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Terbilang angka (sederhana)
 */
export function terbilang(n: number): string {
  const satuan = ["", "satu", "dua", "tiga", "empat", "lima", "enam", "tujuh", "delapan", "sembilan", "sepuluh", "sebelas"];
  if (n < 0) return "";
  if (n < 12) return satuan[n];
  if (n < 20) return terbilang(n - 10) + " belas";
  if (n < 100) return (terbilang(Math.floor(n / 10)) + " puluh" + (n % 10 ? " " + terbilang(n % 10) : "")).trim();
  if (n < 200) return ("seratus" + (n % 100 ? " " + terbilang(n % 100) : "")).trim();
  if (n < 1000) return (terbilang(Math.floor(n / 100)) + " ratus" + (n % 100 ? " " + terbilang(n % 100) : "")).trim();
  if (n < 2000) return ("seribu" + (n % 1000 ? " " + terbilang(n % 1000) : "")).trim();
  return (terbilang(Math.floor(n / 1000)) + " ribu" + (n % 1000 ? " " + terbilang(n % 1000) : "")).trim();
}

/**
 * Konversi nilai angka ke huruf
 */
export function nilaiHuruf(n: number): string {
  if (n <= 0) return "";
  if (n >= 90) return "A";
  if (n >= 85) return "B+";
  if (n >= 80) return "B";
  if (n >= 75) return "C+";
  if (n >= 70) return "C";
  return "D";
}