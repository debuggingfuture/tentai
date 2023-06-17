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
import { IpfsFile } from "./ipfsFIle";
import * as path from "path";
import * as fs from "fs";
import { printSnapshotSystem } from "./utils";

export interface SpheronFolderArgs {
  folderPath: pulumi.Input<string>;
}

export interface SpheronBucketArgs {
  name: pulumi.Input<string>;
}

export class SpheronFolder extends pulumi.CustomResource {
  constructor(
    name: string,
    args: SpheronFolderArgs,
    opts?: pulumi.CustomResourceOptions
  ) {
    super(ConstructType.SpheronFolder, name, args, opts);
  }
}

export class SpheronBucket extends pulumi.ComponentResource {
  constructor(
    name: string,
    args: SpheronBucketArgs,
    opts?: pulumi.ComponentResourceOptions
  ) {
    super(ConstructType.SpheronBucket, name, args, opts);

    console.log("SpheronBucket", args);
  }
}
