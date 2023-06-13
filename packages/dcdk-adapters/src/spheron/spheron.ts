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

export const createIpfsStaticPageWithFolder = async (folderPath: string) => {
  const client = new SpheronClientStorage(getClientConfig());
  const { uploadId, bucketId, protocolLink, dynamicLinks } =
    await client.upload(folderPath, {
      protocol: ProtocolEnum.IPFS,
      name: "test-folder",
    });

  console.log("results", { uploadId, bucketId, protocolLink, dynamicLinks });
};
