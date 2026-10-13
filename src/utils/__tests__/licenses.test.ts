/**
 * Unit test untuk generator license key AXRYZURE Store.
 * Hanya bagian murni (tanpa DOM) yang diuji di sini.
 */
import { describe, expect, it } from "vitest";
import { licenseKey } from "../licenses";

const CHARSET = /^[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{4}(-[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{4}){2}$/;

describe("licenseKey()", () => {
  it("berformat XXXX-XXXX-XXXX", () => {
    const key = licenseKey("tema-figma", "AXZ-2026-0001");
    expect(key).toMatch(CHARSET);
    expect(key).toHaveLength(14);
  });

  it("deterministik: produk + nomor order yang sama → kunci sama", () => {
    expect(licenseKey("tema-figma", "AXZ-2026-0001")).toBe(licenseKey("tema-figma", "AXZ-2026-0001"));
  });

  it("nomor order berbeda → kunci berbeda", () => {
    expect(licenseKey("tema-figma", "AXZ-2026-0001")).not.toBe(
      licenseKey("tema-figma", "AXZ-2026-0002"),
    );
  });

  it("produk berbeda → kunci berbeda", () => {
    expect(licenseKey("tema-figma", "AXZ-2026-0001")).not.toBe(
      licenseKey("kit-notion", "AXZ-2026-0001"),
    );
  });

  it("tidak memakai karakter ambigu (I, L, O, 0, 1)", () => {
    for (let i = 0; i < 50; i++) {
      const key = licenseKey("produk", `AXZ-2026-${String(i).padStart(4, "0")}`);
      expect(key).not.toMatch(/[ILO01]/);
      expect(key).toMatch(CHARSET);
    }
  });
});
