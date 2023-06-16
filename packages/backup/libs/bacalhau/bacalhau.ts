// go ref impl https://github.com/bacalhau-project/bacalhau/commit/40d488d0f3373f18c54eac200e91a44b6974af8e

// empricially case insensitive
export const BACALHAU_MAGIC_ENDPOINT_URL =
  "http://dashboard.bacalhau.org:1000/api/v1/run";

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
