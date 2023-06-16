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

// at a tentai page
// we have hosted

export interface TentaiPageArgs {
  customTemplate: pulumi.Input<string>;
}

// always build image

export class TentaiPage extends pulumi.ComponentResource {
  //   public readonly imageName: pulumi.Output<string>;

  constructor(
    name: string,
    args: TentaiPageArgs,
    opts?: pulumi.ComponentResourceOptions
  ) {
    super(ConstructType.BacalhauJobImage, name, args, opts);

    // new SpheronStaticPage();

    this.registerOutputs({
      //   imageName: this.imageName,
    });
  }
}
