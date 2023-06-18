// Copyright 2016-2021, Pulumi Corporation.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import * as pulumi from "@pulumi/pulumi";
import * as docker from "@pulumi/docker";
import { ConstructType } from "./constructType";
import * as path from "path";
import * as fs from "fs-extra";
import * as os from "os";

export interface BacalhauJobImageArgs {
  imageName: pulumi.Input<string>;
  modelPath: pulumi.Input<string>;
  customTemplate: pulumi.Input<string>;
}

// 3 options

// 1 use existing models inside package
// 2 use custom model file
// 3 use remote image

// For both 1/2, we will make use of docker template and store in model/ folder

export const buildImageWithTemplate = (
  imageName: pulumi.Input<string>,
  customTemplate: pulumi.Input<string>,
  modelPath?: pulumi.Input<string>
) => {
  console.log("buildImageWithTemplate", imageName);
  const dockerTemplatePath = path.resolve(
    __dirname,
    "../templates/gradio-adapter-py/Dockerfile.template"
  );
  // use a /snapshot path at execution

  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "dcdk-model"));
  fs.copyFileSync(dockerTemplatePath, path.resolve(tempDir, "./Dockerfile"));

  if (customTemplate) {
    console.log("build with custom template");
    const modelTemplatePath = path.resolve(
      __dirname,
      "../templates/gradio-adapter-py/" + customTemplate
    );

    // TODO check recusive
    fs.copySync(modelTemplatePath, tempDir, { dereference: true });
  } else {
    console.log("build with model path");
    // TODO ifx
    // fs.copySync(modelPath, tempDir, { dereference: true });
    // ensure included in assets by pkg
  }

  const image = new docker.Image(imageName.valueOf() as string, {
    build: {
      args: {
        IMAGE_WITH_TAG: "ubuntu:latest",
      },
      context: ".",
      dockerfile: "Dockerfile",
    },
    imageName,
    // skipPush: true,
  });

  return {
    imageName: image.baseImageName,
    image,
  };
};
export class BacalhauJobImage extends pulumi.ComponentResource {
  public readonly imageName: pulumi.Output<string>;

  constructor(
    name: string,
    args: BacalhauJobImageArgs,
    opts?: pulumi.ComponentResourceOptions
  ) {
    super(ConstructType.BacalhauJobImage, name, args, opts);

    const image = new docker.RemoteImage(name + "-image", {
      name: args.imageName,
    });
    // const image = buildImageWithTemplate(args.imageName, args.customTemplate);

    this.imageName = image.name;
    this.registerOutputs({
      imageName: this.imageName,
    });
  }
}
