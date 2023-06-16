import pulumi from "@pulumi/pulumi";

export interface BacalhauJobProps {}

export class BacalhauJob extends pulumi.ComponentResource {
  constructor(name: string, opts: any) {
    super("messier:resource:BacalhauJob", name, {}, opts);
  }
}
