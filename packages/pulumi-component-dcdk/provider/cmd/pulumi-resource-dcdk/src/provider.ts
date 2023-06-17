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
import * as provider from "@pulumi/pulumi/provider";
import * as resource from "@pulumi/pulumi/resource";
import { BacalhauJobImage, BacalhauJobImageArgs } from "./bacalhauJobImage";
import { ConstructType } from "./constructType";
import { IpfsStaticPage, IpfsStaticPageArgs } from "./ipfsStaticPage";
import {
  buildSiteWithTemplate,
  createIpfsStaticPageWithFolder,
} from "./spheron/spheron";
import { SpheronStaticPage, SpheronStaticPageArgs } from "./spheronStaticPage";
import { TentaiPage, TentaiPageArgs } from "./tentaiPage";
import { printSnapshotSystem } from "./utils";

async function constructTentaiPage(
  name: string,
  inputs: pulumi.Inputs,
  options: pulumi.ComponentResourceOptions
): Promise<provider.ConstructResult> {
  // Create the component resource.
  const staticPage = new TentaiPage(name, inputs as TentaiPageArgs, options);

  // Return the component resource's URN and outputs as its state.
  return {
    urn: staticPage.urn,
    state: {
      websiteUrl: staticPage.websiteUrl,
    },
  };
}

async function constructSpheronStaticPage(
  name: string,
  inputs: pulumi.Inputs,
  options: pulumi.ComponentResourceOptions
): Promise<provider.ConstructResult> {
  // Create the component resource.
  const staticPage = new SpheronStaticPage(
    name,
    inputs as SpheronStaticPageArgs,
    options
  );

  // Return the component resource's URN and outputs as its state.
  return {
    urn: staticPage.urn,
    state: {
      websiteUrl: staticPage.websiteUrl,
    },
  };
}

async function constructIpfsStaticPage(
  name: string,
  inputs: pulumi.Inputs,
  options: pulumi.ComponentResourceOptions
): Promise<provider.ConstructResult> {
  const staticPage = new IpfsStaticPage(
    name,
    inputs as IpfsStaticPageArgs,
    options
  );

  // Return the component resource's URN and outputs as its state.
  return {
    urn: staticPage.urn,
    state: {
      websiteUrl: staticPage.websiteUrl,
    },
  };
}

async function constructBacalhauJobImage(
  name: string,
  inputs: pulumi.Inputs,
  options: pulumi.ComponentResourceOptions
): Promise<provider.ConstructResult> {
  const jobImage = new BacalhauJobImage(
    name,
    inputs as BacalhauJobImageArgs,
    options
  );

  // Return the component resource's URN and outputs as its state.
  return {
    urn: jobImage.urn,
    state: {
      imageName: jobImage.imageName,
    },
  };
}

type ConstructStrategy = (
  name: string,
  inputs: pulumi.Inputs,
  options: pulumi.ComponentResourceOptions
) => Promise<provider.ConstructResult>;

const CONSTRUCT_STRATEGIES: { [key: string]: ConstructStrategy } = {
  [ConstructType.IpfsStaticPage]: constructIpfsStaticPage,
  [ConstructType.SpheronStaticPage]: constructSpheronStaticPage,

  [ConstructType.TentaiPage]: constructTentaiPage,
  [ConstructType.BacalhauJobImage]: constructBacalhauJobImage,
};

/**
 * create method is only triggered for custom resources not components
 */

export class Provider implements provider.Provider {
  constructor(readonly version: string, readonly schema: string) {}

  async create(urn: resource.URN, inputs: any) {
    console.log("create resource", urn, inputs);
    // delegate

    if (urn.includes(ConstructType.SpheronFolder)) {
      await buildSiteWithTemplate(urn, inputs.folderPath);
    }

    // handle at compile time
    return {
      id: "1",
    };
  }

  async delete(id: resource.ID, urn: resource.URN, props: any) {
    console.log("delete resource", urn);

    return;
  }

  async diff(urn: resource.URN, inputs: any) {
    console.log("diff", urn, inputs);

    return {};
  }

  async construct(
    name: string,
    type: string,
    inputs: pulumi.Inputs,
    options: pulumi.ComponentResourceOptions
  ): Promise<provider.ConstructResult> {
    const strategy = CONSTRUCT_STRATEGIES[type as ConstructType];
    if (!strategy) {
      console.log(`supported ${Object.keys(CONSTRUCT_STRATEGIES)}`);
      throw new Error(`unknown resource type ${type}`);
    }
    // For debug
    // printSnapshotSystem();
    return await strategy(name, inputs, options);
  }
}
