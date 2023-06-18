import * as fs from "fs";
import * as path from "path";
import * as React from "react";
import {
  RenderConfig,
  TentaiUiComponentType,
  Widget,
} from "../components/Widget";
import { Container, Grid, Paper, Typography } from "@mui/material";
import { GetStaticProps } from "next/types";

import { ModelConfig } from "../libs/job";
// https://github.com/dusty-nv/jetson-inference/tree/master

let baseConfig = {
  modelConfig: {
    name: "hello world",
    job: {
      docker: { image: "ubuntu", entrypoint: ["echo", "hello"] },
    },
    resultTypes: ["text"],
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
      // {
      //   componentType: TentaiUiComponentType.Image,
      // },
      {
        componentType: TentaiUiComponentType.TextArea,
      },
    ],
  },
};

export type PageConfig = {
  name: string;
  modelConfig: ModelConfig;
  renderConfig: RenderConfig;
};

export const getStaticProps: GetStaticProps<{
  config: PageConfig;
}> = async () => {
  // __dirname will be non usable
  // https://nextjs.org/docs/pages/api-reference/functions/get-static-props#reading-files-use-processcwd

  console.log("getStaticProps cwd", process.cwd());
  const rawConfig = fs.readFileSync(
    path.resolve(process.cwd(), "./tentai.config.json")
  );

  const config = JSON.parse(rawConfig.toString());

  return { props: { config } };
};

export default function Home({ config }: { config: PageConfig }) {
  return (
    <>
      <Container>
        <Grid container spacing={2}>
          <Grid container item spacing={2} xs={12}>
            <Grid item xs={4}>
              <h2>Shilling my AI Model: {config.name} </h2>
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
          {/* <Grid container item xs={12}>
        <Grid item xs={4}>
          <Typography variant="subtitle1">Powered by TENTAI</Typography>
        </Grid>
      </Grid> */}
        </Grid>
      </Container>{" "}
      <Paper
        sx={{
          marginTop: "calc(10% + 60px)",
          position: "fixed",
          bottom: 0,
          backgroundColor: "black",
          color: "white",
          width: "100%",
          textAlign: "center",
        }}
        component="footer"
        square
        variant="outlined"
      >
        <Typography variant="subtitle1">Powered by TENTAI✨</Typography>
      </Paper>
    </>
  );
}
