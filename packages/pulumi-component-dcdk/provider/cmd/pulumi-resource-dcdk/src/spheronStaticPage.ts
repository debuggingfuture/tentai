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
import { ConstructType } from "./constructType";
import * as path from "path";
import * as fs from "fs";
import { SpheronFolder } from "./spheron";

export interface SpheronStaticPageArgs {
  folderPath: pulumi.Input<string>;
}

export class SpheronStaticPage extends pulumi.ComponentResource {
  public readonly websiteUrl: pulumi.Output<string>;

  constructor(
    name: string,
    args: SpheronStaticPageArgs,
    opts?: pulumi.ComponentResourceOptions
  ) {
    super(ConstructType.SpheronStaticPage, name, args, opts);

    // DEBUG
    // const results = fs.readdirSync(args.folderPath);
    // console.log("template directory", results);

    const results = new SpheronFolder(name + "-folder", {
      folderPath: args.folderPath,
    });
    console.log("SpheronFolder created");
    this.websiteUrl = pulumi.output(
      "https://hackfs2023-test.debuggingfuture.com/"
    );
    this.registerOutputs({
      websiteUrl: this.websiteUrl,
    });
  }
}
