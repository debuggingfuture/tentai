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
import * as fs from "fs";

export interface BacalhauJobImageArgs {
  imageName: pulumi.Input<string>;
  customTemplate: pulumi.Input<string>;
}

// always build image

export const matchTemplate = (
  customTemplate: pulumi.Input<string>,
  imageName: pulumi.Input<string>
) => {
  const resourceImageName = "image";
  // use a /snapshot path at execution
  if (customTemplate) {
    console.log("build with customtemplate", customTemplate, imageName);
    // troublesome to manage files inside package due to multiple build process
    const dockerFileContent = `
ARG IMAGE_WITH_TAG=python:3.10-slim


FROM $IMAGE_WITH_TAG

RUN "echo" "Hello from gradio-adapter-py"

`;
    fs.writeFileSync("Dockerfile", dockerFileContent);

    const image = new docker.Image(resourceImageName, {
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
      imageName: image.imageName,
      image,
    };
  }

  const image = new docker.RemoteImage(resourceImageName, { name: imageName });

  return {
    imageName: image.name,
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

    const image = matchTemplate(args.customTemplate, args.imageName);

    this.imageName = image.imageName;
    this.registerOutputs({
      imageName: this.imageName,
    });
  }
}
