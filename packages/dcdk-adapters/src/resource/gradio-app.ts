import { Construct } from "constructs";

// We either generate with default template

export interface GradioAppProps {
  pyPath: string;
}

export class GradioApp extends Construct {
  constructor(scope: Construct, id: string, props: GradioAppProps) {
    super(scope, id);
  }
}
