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
import * as path from "path";
import * as fs from "fs";
import * as pulumi from "@pulumi/pulumi";
import * as docker from "@pulumi/docker";
import { ConstructType } from "./constructType";
import { SpheronStaticPage } from "./spheronStaticPage";
import { BacalhauJobImage } from "./bacalhauJobImage";

// at a tentai page
// we have hosted

export interface TentaiPageArgs {
  siteTemplate: pulumi.Input<string>;
  jobImageName: pulumi.Input<string>;
}

// always build image

export const MODEL_STRATEGIES = {
  translations: {
    siteTemplate: "tentai-template-next-ts",
  },
};

export class TentaiPage extends pulumi.ComponentResource {
  public readonly websiteUrl: pulumi.Output<string>;

  constructor(
    name: string,
    args: TentaiPageArgs,
    opts?: pulumi.ComponentResourceOptions
  ) {
    super(ConstructType.TentaiPage, name, args, opts);

    // always this template for now
    const templatePath = path.resolve(
      __dirname,
      "../templates/tentai-template-next-ts"
    );
    console.log("templatePath", templatePath);

    // inject jobImageName as site config

    const results = new SpheronStaticPage("static-site", {
      folderPath: templatePath,
    });

    this.websiteUrl = pulumi.output(
      "https://hackfs2023-test.debuggingfuture.com/"
    );

    this.registerOutputs({
      websiteUrl: this.websiteUrl,
    });
  }
}
