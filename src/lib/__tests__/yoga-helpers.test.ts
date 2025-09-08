import { describe, it, expect } from "vitest";
import { applySafetyAdjustments, tempoAdjust } from "../yoga-helpers";
import { PoseId } from "../../types/yoga";

describe("applySafetyAdjustments", () => {
  it("inserts counter pose between twist and backbend", () => {
    const seq = applySafetyAdjustments([PoseId.TwistLow, PoseId.Bridge]);
    expect(seq).not.toEqual([PoseId.TwistLow, PoseId.Bridge]);
    expect(seq).toContain(PoseId.ForwardFold);
  });
});

describe("tempoAdjust", () => {
  it("halves duration at 2x tempo", () => {
    expect(tempoAdjust(60, 2)).toBe(30);
  });
});
