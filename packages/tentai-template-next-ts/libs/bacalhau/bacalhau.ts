// go ref impl https://github.com/bacalhau-project/bacalhau/commit/40d488d0f3373f18c54eac200e91a44b6974af8e

// empricially case insensitive
// sadly we need aws proxy at frontend for both HTTPS & CORS to http://dashboard.bacalhau.org:1000/api/v1/run
// @ts-ignore
import { IS_DEV } from "../env";

export const BACALHAU_MAGIC_ENDPOINT_URL = IS_DEV
  ? "http://dashboard.bacalhau.org:1000/api/v1/run"
  : "https://m53xh5o55j.execute-api.us-west-2.amazonaws.com/default/httpsProxy";

import fetch from "cross-fetch";
import { BacalhauConfig, Publisher, Verifier } from "./schema-bacalhau";

export const withDefaultsJob = () => {
  return {
    engine: "Docker",
    docker: { image: "ubuntu", entrypoint: ["echo", "hello"] },
    deal: { Concurrency: 1 },
    verifier: Verifier.Noop,
    publisherSpec: {
      type: Publisher.IPFS,
    },
  };
};

export const createJob = (
  jobMetadata: Partial<BacalhauConfig>
): Partial<BacalhauConfig> => {
  return {
    ...withDefaultsJob(),
    ...jobMetadata,
  };
};

export const submitJob = async (job: Partial<BacalhauConfig>) => {
  console.log("submitJob", job);
  const results = await fetch(BACALHAU_MAGIC_ENDPOINT_URL, {
    method: "POST",
    body: JSON.stringify(job),
  }).then((res) => res.json());

  console.log("results", results);

  const { cid } = results;
  return {
    cid,
  };
};
