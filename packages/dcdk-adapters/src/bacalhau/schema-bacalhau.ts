// generated via chat gpt from
// https://raw.githubusercontent.com/bacalhau-project/bacalhau/main/pkg/model/schemas/bacalhau.ipldsch
export enum Resource {
  IPFS = "ipfs",
  HTTP = "http",
}

export interface DockerInputs {
  entrypoint: string[];
  workdir: string;
  mounts: Record<string, Resource>;
  outputs: Record<string, any | null>;
  env: Record<string, string>;
}

export interface WasmInputs {
  entrypoint: string;
  parameters: string[];
  modules: Resource[];
  mounts: Record<string, Resource>;
  outputs: Record<string, any | null>;
  env: Record<string, string>;
}

// need string instead of number as in go

export enum Publisher {
  Noop = "Noop",
  IPFS = "IPFS",
  Estuary = "Estuary",
  FilecoinLotus = "FilecoinLotus",
}

export enum Verifier {
  Noop = "Noop",
  Deterministic = "Deterministic",
}

export interface ResourceSpec {
  cpu: number; // Millicores
  disk: number; // ByteSize
  memory: number; // ByteSize
  gpu: number;
}

export interface BacalhauConfig {
  docker?: any;
  // not working
  // publisher?: Publisher;
  publisherSpec: {
    type: Publisher;
  };
  verifier: Verifier;
  timeout: number; // Duration
  resources: ResourceSpec;
  annotations: string[];
  dnt: boolean;
}
