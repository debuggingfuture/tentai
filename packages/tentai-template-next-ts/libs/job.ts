// most should be sent via backend already
import * as _ from "lodash";
import { createJob } from "./bacalhau/bacalhau";

import { File, Web3Storage } from "web3.storage";

export type InputParams = {
  inputs: {
    type: string;
    value: string;
  }[];
};

export const getAccessToken = () => {
  return (
    process.env.WEB3STORAGE_TOKEN || process.env.NEXT_PUBLIC_WEB3STORAGE_TOKEN!
  );
};

export const createStorageClient = () => {
  return new Web3Storage({ token: getAccessToken() });
};

export type ModelConfig = any;

// lazy eval. could support functional approach and include scripting at config itself to make it more generic
// now for simplicity we just stringify everything

export const matchInputParams = async (inputParams: any) => {
  const inputs = inputParams?.inputs;

  const client = await createStorageClient();

  const results = await Promise.all(
    inputs.map(async (input: any, i: number) => {
      if (input.type === "text") {
        return [_.camelCase(["input", i + 1, "text"].join("")), input.value];
      }
      if (input.type === "file") {
        const blob = new global.Blob([input.value]);
        const files = [new File([blob as BlobPart], input)];

        const cid = await client.put(files);
        console.log("stored files with cid:", cid);

        return [_.camelCase(["input", i + 1, "file"].join("")), cid];
      }
    })
  );
  return _.fromPairs(results);
};

export const mapJobWithModelInput = async (
  modelConfig: any,
  inputParams: any
) => {
  const compiled = _.template(JSON.stringify(modelConfig?.job));

  const inputByKey = await matchInputParams(inputParams);
  const compiledJob = JSON.parse(compiled(inputByKey));
  return createJob(compiledJob);
};

// export const submitJobWithModel = (inputParmas: any) => {
//   return createJob({
//     docker: { image: "ubuntu", entrypoint: ["echo", "hello"] },
//   });
// };
