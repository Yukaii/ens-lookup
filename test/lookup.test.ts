import test from "ava";
import { lookup } from "../src/index";

test("resolve ens domain", async (t) => {
  const result = await lookup("vitalik.eth");

  t.true(result.found);
  t.is(result.address, "0xd8da6bf26964af9d7eed9e03e53415d37aa96045");

  console.log(result)
});

test("resolve address", async (t) => {
  const result = await lookup("0xd8da6bf26964af9d7eed9e03e53415d37aa96045");

  t.true(result.found);
  t.is(result.ens, "vitalik.eth");
});
