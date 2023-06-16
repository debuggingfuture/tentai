// mimic resource
import * as pulumi from "@pulumi/pulumi";
import * as provider from "@pulumi/pulumi/provider";
import * as resource from "@pulumi/pulumi/resource";

export class IpfsFile extends pulumi.CustomResource {
  constructor(name: string, args: any, opts?: pulumi.CustomResourceOptions) {
    super("dcdk:index:IpfsFile", name, args, opts);

    console.log("IpfsFile", name, args);
  }

  // create()
}
