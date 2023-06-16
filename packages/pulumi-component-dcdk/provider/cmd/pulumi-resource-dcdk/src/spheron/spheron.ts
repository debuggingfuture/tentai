import os from "os";
import path from "path";
import fs from "fs-extra";
import {
  SpheronClient as SpheronClientSite,
  ProtocolEnum,
  ProviderEnum,
  FrameworkEnum,
  NodeVersionEnum,
  Deployment,
  DeploymentStatusEnum,
} from "@spheron/site";
import { SpheronClient as SpheronClientStorage } from "@spheron/storage";
import { SPHERON_TOKEN } from "../env";
import { spawn, spawnSync } from "child_process";

// it is compulsory to hv a github repo to deploy
// make use of tools to build the necessary bracnh

// TODO lazy load singleton
export const getClientConfig = () => {
  return { token: SPHERON_TOKEN! };
};

export const storeFile = async () => {};

export const deploySite = async () => {
  const client = new SpheronClientSite(getClientConfig());
  const results = await client.deployments.deploy({
    gitUrl: "git@github.com:debuggingfuture/dcdk-sample-next.git", // the url of the repository
    projectName: "dcdk-sample-next", // if the project for the repository does not exists, a new project will be created with this name
    environmentVariables: {
      KEY_1: "value1",
    },
    provider: ProviderEnum.GITHUB, // the provider of the git url
    branch: "master", // the branch name that should be deployed
    protocol: ProtocolEnum.IPFS, // the protocol on which the deployment should be uploaded
    configuration: {
      framework: FrameworkEnum.NEXT,
      workspace: "",
      installCommand: "yarn install",
      buildCommand: "yarn build",
      publishDir: "out",
      nodeVersion: NodeVersionEnum.V_16,
    },
    gitProviderPreferences: {
      prComments: true,
      commitComments: false,
      buildStatus: false,
      githubDeployment: true,
    },
  });

  console.log("results", results);

  const { projectId } = results;

  // TODO poll for deployment status and match deploymentId
  const deployments: Deployment[] = await client.projects.getDeployments(
    projectId,
    {
      skip: 0,
      limit: 5,
      status: DeploymentStatusEnum.QUEUED,
    }
  );
  console.log("deployments", deployments);
};

export const createIpfsStaticPageWithFolder = async (
  folderPath: string,
  name: string
) => {
  const client = new SpheronClientStorage(getClientConfig());
  const { uploadId, bucketId, protocolLink, dynamicLinks } =
    await client.upload(folderPath, {
      protocol: ProtocolEnum.IPFS,
      name,
    });

  console.log("results", { uploadId, bucketId, protocolLink, dynamicLinks });

  return { uploadId, bucketId, protocolLink, dynamicLinks };
};

export enum TentaiUiComponentType {
  TextField = "TextField",
  TextArea = "TextArea",
  Image = "Image",
  Chart = "Chart",
}

// TODO refactor
export const buildSiteWithTemplate = async (name: string) => {
  const templatePath = path.resolve(
    __dirname,
    "../../templates/tentai-template-nextjs"
  );
  const client = new SpheronClientStorage(getClientConfig());
  console.log("buildSiteWithTemplate");
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "dcdk"));
  fs.copySync(templatePath, tempDir, { dereference: true });

  const buildProcess = spawnSync("yarn install && yarn build", {
    cwd: tempDir,
    shell: true,
  });

  const configFileContent = {
    modelConfig: {
      job: {
        docker: {
          image: "docker.io/tentai-gradio-adapter-py:latest",
          entrypoint: ["echo", "hello"],
        },
      },
    },
    renderConfig: {
      inputs: [
        {
          id: "main-input",
          label: "input",
          componentType: TentaiUiComponentType.TextArea,
        },
      ],
      outputs: [
        {
          componentType: TentaiUiComponentType.Image,
        },
      ],
    },
  };

  const configPath = path.resolve(tempDir, "./tentai-config.json");
  fs.writeFileSync(configPath, JSON.stringify(configFileContent));

  const buildFolder = path.resolve(tempDir, "./out");
  console.log("buildProcess out", buildProcess.stdout.toString());
  console.log("buildProcess err", buildProcess.stderr.toString());

  console.log("create SpheronFolder");
  const { protocolLink, dynamicLinks } = await createIpfsStaticPageWithFolder(
    buildFolder,
    name
  );

  console.log("create success", dynamicLinks);
  return { protocolLink, dynamicLinks };
};
