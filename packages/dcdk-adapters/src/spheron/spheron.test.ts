import path from "path";
import { Domain, ProtocolEnum } from "@spheron/site";
import { deploySite, getClientConfig } from "./spheron";
import {
  SpheronClient as SpheronClientStorage,
  DomainTypeEnum,
} from "@spheron/storage";

jest.setTimeout(60 * 1000);

const TEST_BUCKET_ID = "6488945d2f270c0012f87c22";
const TEST_DOMAIN_NAME = "hackfs2023-test.debuggingfuture.com";

describe("spheron", () => {
  test.skip("#deploySite", async () => {
    await deploySite();
  });

  beforeAll(async () => {
    const client = new SpheronClientStorage(getClientConfig());
    // ignore domain not found
    await client
      .deleteBucketDomain(TEST_BUCKET_ID, TEST_DOMAIN_NAME)
      .catch((err) => null);
  });

  test("#uploadFile", async () => {
    const filePath = path.resolve(
      __dirname,
      "../../fixture/file1.fixture.json"
    );

    const client = new SpheronClientStorage(getClientConfig());
    const { uploadId, bucketId, protocolLink, dynamicLinks } =
      await client.upload(filePath, {
        protocol: ProtocolEnum.IPFS,
        name: "test-file",
      });

    // still uploaded as wrapped directory
    expect(uploadId).toEqual(expect.any(String));
  });

  test("#uploadDirectory", async () => {
    const filePath = path.resolve(__dirname, "../../fixture");

    // seems bucket id deterministic form name, cid at protocolLink
    const client = new SpheronClientStorage(getClientConfig());
    const { uploadId, bucketId, protocolLink, dynamicLinks } =
      await client.upload(filePath, {
        protocol: ProtocolEnum.IPFS,
        name: "test-folder",
      });

    console.log("results", {
      uploadId,
      bucketId,
      protocolLink,
      dynamicLinks,
    });

    expect(uploadId).toEqual(expect.any(String));
  });

  test.only("add domain and verify", async () => {
    const client = new SpheronClientStorage(getClientConfig());

    const bucketDomain = await client.addBucketDomain(TEST_BUCKET_ID, {
      link: "https://bafybeigxuntmtpousslzjxh4t2oa7jo7e7zgums72yost5ayan3pjypz6m.ipfs.sphn.link",
      type: DomainTypeEnum.SUBDOMAIN,
      name: TEST_DOMAIN_NAME,
    });

    console.log("bucketDomain", bucketDomain);
    const domainStatus = await client.verifyBucketDomain(
      TEST_BUCKET_ID,
      TEST_DOMAIN_NAME
    );

    expect(domainStatus?.verified).toEqual(true);
  });
});
