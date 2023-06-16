import * as React from "react";
import {
  RenderConfig,
  TentaiUiComponentType,
  Widget,
} from "../components/Widget";
import { Container, Grid, Typography } from "@mui/material";
import { GetStaticProps } from "next/types";

// https://github.com/dusty-nv/jetson-inference/tree/master

let config = {
  modelConfig: {
    job: {
      docker: { image: "ubuntu", entrypoint: ["echo", "hello"] },
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

export type PageConfig = {
  modelConfig: any;
  renderConfig: RenderConfig;
};

export const getStaticProps: GetStaticProps<{
  config: PageConfig;
}> = async () => {
  const fs = require("fs");
  // fs.readFileSync(path.resolve('./app')
  // config
  return { props: { config } };
};

export default function Home({ config }: { config: PageConfig }) {
  return (
    <Container>
      <Grid container spacing={2}>
        <Grid container item spacing={2} xs={12}>
          <Grid item xs={4}>
            <h2>Shilling my AI</h2>
          </Grid>
        </Grid>
        <Grid container item xs={12}>
          <Grid item xs={12}>
            <Widget
              modelConfig={config.modelConfig}
              renderConfig={config.renderConfig}
            ></Widget>
          </Grid>
        </Grid>
        <Grid container item xs={12}>
          <Grid item xs={4}>
            <Typography variant="subtitle1">Powered by Tentai✨</Typography>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}
