import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("booking success renders a dismissible confirmation dialog", async () => {
  const source = await readFile(new URL("../src/main.jsx", import.meta.url), "utf8");

  assert.match(source, /bookingConfirmation/);
  assert.match(source, /booking-success-dialog/);
  assert.match(source, /预约提交成功/);
  assert.match(source, /setBookingConfirmation\(data\.booking\)/);
});
