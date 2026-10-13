/**
 * Unit test untuk helper format & util bersama AXRYZURE Store.
 * Asumsi: timezone mesin uji = UTC (default runner GitHub Actions).
 */
import { describe, expect, it } from "vitest";
import {
  EASE,
  cx,
  formatCompact,
  formatDate,
  formatMonthYear,
  formatNumber,
  formatPrice,
  hashString,
  round2,
  s,
} from "../format";

describe("formatPrice()", () => {
  it("menampilkan bilangan bulat tanpa desimal", () => {
    expect(formatPrice(12)).toBe("$12");
    expect(formatPrice(0)).toBe("$0");
  });

  it("menampilkan 2 desimal untuk harga pecahan", () => {
    expect(formatPrice(12.5)).toBe("$12.50");
    expect(formatPrice(9.99)).toBe("$9.99");
  });
});

describe("formatCompact() & formatNumber()", () => {
  it("meringkas angka besar", () => {
    expect(formatCompact(1_500)).toBe("1.5K");
    expect(formatCompact(2_400_000)).toBe("2.4M");
    expect(formatCompact(999)).toBe("999");
  });

  it("formatNumber() memakai pemisah ribuan", () => {
    expect(formatNumber(1_234_567)).toBe("1,234,567");
    expect(formatNumber(42)).toBe("42");
  });
});

describe("formatDate() & formatMonthYear()", () => {
  it("memformat tanggal bahasa Inggris", () => {
    expect(formatDate("2026-10-13")).toBe("Oct 13, 2026");
    expect(formatMonthYear("2026-10-13")).toBe("Oct 2026");
  });
});

describe("hashString()", () => {
  it("deterministik untuk input yang sama", () => {
    expect(hashString("axryzure")).toBe(hashString("axryzure"));
  });

  it("berbeda untuk input berbeda", () => {
    expect(hashString("produk-a")).not.toBe(hashString("produk-b"));
  });

  it("selalu bilangan non-negatif", () => {
    for (const v of ["", "a", "produk-panjang-sekali-123", "🎧 emoji"]) {
      expect(hashString(v)).toBeGreaterThanOrEqual(0);
    }
  });
});

describe("helper kecil", () => {
  it("round2() membulatkan ke 2 desimal", () => {
    expect(round2(2.345)).toBe(2.35);
    expect(round2(1.2345)).toBe(1.23);
    expect(round2(10)).toBe(10);
  });

  it("s() menambahkan 's' hanya untuk jamak", () => {
    expect(s(1)).toBe("");
    expect(s(0)).toBe("s");
    expect(s(2)).toBe("s");
  });

  it("cx() menggabungkan class dan membuang nilai kosong", () => {
    expect(cx("a", false && "b", undefined, null, "c")).toBe("a c");
    expect(cx()).toBe("");
  });

  it("EASE adalah kurva animasi 4 titik", () => {
    expect(EASE).toHaveLength(4);
  });
});
