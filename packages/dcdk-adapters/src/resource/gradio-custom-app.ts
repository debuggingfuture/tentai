import { Construct } from "constructs";

export interface GradioCustomAppProps {
  pyPath: string;
}

export class GradioCustomApp extends Construct {
  constructor(scope: Construct, id: string, props: GradioCustomAppProps) {
    super(scope, id);
  }
}
