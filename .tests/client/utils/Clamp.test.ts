import { describe, expect, it } from "vitest";

import { Clamp } from "../../../client/src/utils/Clamp";


describe("Clamp", () => {
  it("keeps a value inside the range", () => {
    expect(Clamp(5, 0, 10)).toBe(5);
  });

  it("limits a value to the range bounds", () => {
    expect(Clamp(-1, 0, 10)).toBe(0);
    expect(Clamp(11, 0, 10)).toBe(10);
  });
});
