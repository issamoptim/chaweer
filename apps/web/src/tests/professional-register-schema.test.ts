import { describe, it, expect } from "vitest";
import { professionalRegisterSchema } from "@/features/professional/schemas/professional-register-schema";

describe("professionalRegisterSchema", () => {
  const valid = {
    email: "avocat@cabinet.com",
    password: "Password1",
    confirmPassword: "Password1",
  };

  it("accepts a valid payload", () => {
    expect(professionalRegisterSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects an invalid email", () => {
    expect(professionalRegisterSchema.safeParse({ ...valid, email: "not-an-email" }).success).toBe(
      false
    );
  });

  it("rejects a password without a digit", () => {
    expect(
      professionalRegisterSchema.safeParse({
        ...valid,
        password: "Password",
        confirmPassword: "Password",
      }).success
    ).toBe(false);
  });

  it("rejects a password shorter than 8 characters", () => {
    expect(
      professionalRegisterSchema.safeParse({
        ...valid,
        password: "Pass1",
        confirmPassword: "Pass1",
      }).success
    ).toBe(false);
  });

  it("rejects mismatched confirmation", () => {
    const result = professionalRegisterSchema.safeParse({
      ...valid,
      confirmPassword: "Different1",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.path).toContain("confirmPassword");
    }
  });
});
