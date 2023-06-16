import { readFileSync } from "fs";
import { Provider } from "./provider";

describe("provider", () => {
  test.skip("match job", async () => {
    const schema: string = readFileSync(require.resolve("./schema.json"), {
      encoding: "utf-8",
    });

    const provider = new Provider("0.0.1", schema);

    // expect(results?.cid).toEqual(expect.any(String));
  });
});
