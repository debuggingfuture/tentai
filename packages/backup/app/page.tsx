import * as React from "react";
import { TentaiUiComponentType, Widget } from "@/components/Widget";
import { Container, Grid } from "@mui/material";

export default function Home() {
  return (
    <Container>
      <Grid container>
        <Grid item>
          <h2>Shilling my AI</h2>
        </Grid>
      </Grid>
      <div>
        <h3>Powered by Tentai</h3>
      </div>
    </Container>
  );
}
