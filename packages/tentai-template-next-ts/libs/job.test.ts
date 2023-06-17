import * as _ from "lodash";
import { Blob } from "buffer";
import { describe, test } from "@jest/globals";
import {
  createStorageClient,
  mapJobWithModelInput,
  matchInputParams,
} from "./job";
import { File } from "web3.storage";

// @ts-ignore
global.Blob = Blob;

export const createFileObjects = () => {
  // You can create File objects from a Blob of binary data
  // see: https://developer.mozilla.org/en-US/docs/Web/API/Blob
  // Here we're just storing a JSON object, but you can store images,
  // audio, or whatever you want!
  const obj = { hello: "world" };
  const blob = new Blob([JSON.stringify(obj)], { type: "application/json" });

  const files = [
    new File(["contents-of-file-1"], "plain-utf8.txt"),
    new File([blob as BlobPart], "hello.json"),
  ];
  return files;
};

describe("jobs", () => {
  // jsdom not working well with esm, just test with node files
  test("store files", async () => {
    const client = await createStorageClient();
    // jsdom not working well with esm, just test with node
    const files = createFileObjects();
    console.log(`read ${files.length} file(s)`);
    const cid = await client.put(files);
    console.log("stored files with cid:", cid);
    expect(cid).toEqual(expect.any(String));
  });

  test("#matchInputParams", async () => {
    const results = await matchInputParams({
      inputs: [
        {
          type: "text",
          value: "abc",
        },
        {
          type: "file",
          value: "mock-image",
        },
      ],
    });
    expect(results?.input1Text).toEqual("abc");
    expect(results?.input2File).toEqual(expect.any(String));
  });
  test.only("interpolate with text", async () => {
    const modelConfig = {
      job: {
        docker: {
          image: "ghcr.io/bacalhau-project/examples/stable-diffusion-gpu:0.0.1",
          entrypoint: [
            "python",
            "main.py",
            "--o",
            "./outputs",
            "--p",
            "<%= input1Text %>",
          ],
        },
      },
    };

    const inputParams = {
      inputs: [
        {
          type: "text",
          value: "cod swimming through data",
        },
      ],
    };
    const job = await mapJobWithModelInput(modelConfig, inputParams);

    expect(job.docker.entrypoint?.[5]).toEqual("cod swimming through data");
  });

  test("interpolate with file", async () => {
    const modelConfig = {
      job: {
        docker: {
          image: "ghcr.io/bacalhau-project/examples/stable-diffusion-gpu:0.0.1",
          entrypoint: [
            "python",
            "main.py",
            "--o",
            "./outputs",
            "--p",
            "<%= input1File %>",
          ],
        },
      },
    };
    const inputParams = {
      inputs: [
        {
          type: "file",
          value: "a.img",
        },
      ],
    };
    const values = await matchInputParams(inputParams);
    // expect(!!compiled(values
    //   ).match(/cod swimming through data/)).toEqual(true);
  });
});
