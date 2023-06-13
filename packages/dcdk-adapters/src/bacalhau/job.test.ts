import { createJob, submitJob } from "./job";

describe("bacalhau job", () => {
  // https://docs.bacalhau.org/running-node/networking#generic-endpoint

  test("submitJob", async () => {
    const results = await submitJob(
      createJob({
        docker: { image: "ubuntu", entrypoint: ["echo", "hello"] },
      })
    );

    expect(results?.cid).toEqual(expect.any(String));
  });
});
