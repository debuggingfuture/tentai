// base on static config, render corresponding components

// gradio use pre-defined, fine grained dependencies config across blocks to control states, i.e. change in input block will trigger output block update

// here we simplify to stick with inputs triggering outputs
// for case of auto-complete output overriding input we will need mechanism to avoid loop

// we could go for more performant approach https://xstate.js.org/docs/recipes/react.html#global-state-react-context

// reserve terms block/inline for node inside richtext (e.g. slatejs)

import * as React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { TextareaAutosize } from "@mui/base";
import {
  Button,
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
  TextField,
} from "@mui/material";
import { submitJobWithModel } from "../libs/bacalhau/bacalhau";
import { fetchWithSaturn } from "../libs/saturn";
import { ModelConfig } from "../libs/model";

export enum TentaiUiComponentType {
  TextField = "TextField",
  TextArea = "TextArea",
  Image = "Image",
  Chart = "Chart",
}

export type Input = {
  id?: string;
  key?: string;
  label?: string;
  componentType: TentaiUiComponentType;
};

export type Output = {
  componentType: TentaiUiComponentType;
};

export type RenderConfig = {
  inputs: Input[];
  outputs: Output[];
};

export const renderTextField = (props: any) => {
  const { componentType, ...rest } = props;
  return <TextField {...rest} defaultValue="Default Value" />;
};

export const renderTextArea = (props: any) => {
  const { componentType, ...rest } = props;
  return <TextareaAutosize minRows={10} {...rest} />;
};

export const renderImage = () => {
  return <div>Image</div>;
};

export const renderChart = () => {
  return <div>Chart</div>;
};

export type WidgetProps = {
  modelConfig: ModelConfig;
  renderConfig: RenderConfig;
};

export type TentaiUiComponent = Input | Output;

const RENDER_STRATEGIES: Record<
  TentaiUiComponentType,
  (component: TentaiUiComponent) => React.JSX.Element
> = {
  [TentaiUiComponentType.TextField]: renderTextField,
  [TentaiUiComponentType.TextArea]: renderTextArea,
  [TentaiUiComponentType.Image]: renderImage,
  [TentaiUiComponentType.Chart]: renderChart,
};

export const ComponentsGrid = ({
  components,
}: {
  components: TentaiUiComponent[];
}) => {
  return (
    <>
      {components.map((component, i) => {
        const strategy = RENDER_STRATEGIES[component.componentType];
        return (
          <Grid key={component.componentType + "-" + i} item xs={12}>
            {(component as Input).label && (
              <InputLabel htmlFor="my-input">input</InputLabel>
            )}

            {strategy(component)}
          </Grid>
        );
      })}
    </>
  );
};

export const Widget = ({ modelConfig, renderConfig }: WidgetProps) => {
  const [bacalhauResults, setBacalhauResults] = React.useState({});
  const [results, setResults] = React.useState({});
  return (
    <Grid container>
      <Grid item container xs={6} sx={{ border: 1 }}>
        <ComponentsGrid components={renderConfig.inputs} />
        <Grid item xs={4}>
          {" "}
          <Button
            onClick={async () => {
              console.log("submitJob");
              const bacalhauResults = await submitJobWithModel(modelConfig);
              console.log("bacalhauResults", bacalhauResults);
              setBacalhauResults(bacalhauResults);

              const { cid } = bacalhauResults;
              const results = await fetchWithSaturn("/ipfs/" + cid);
              const text = await results.text();
              setResults(text);
            }}
          >
            Submit
          </Button>
        </Grid>
      </Grid>

      <Grid item container xs={6} sx={{ border: 1 }}>
        <ComponentsGrid components={renderConfig.outputs} />
      </Grid>
      <Grid container xs={12}>
        <Grid item xs={12}>
          <h3>Bacalhau results</h3>
          raw:
          <pre>{JSON.stringify(bacalhauResults, null, 2)}</pre>
          <pre>{JSON.stringify(bacalhauResults, null, 2)}</pre>
        </Grid>
        <Grid item xs={12}>
          <h3>Parsed results</h3>
          raw:
          <pre>{JSON.stringify(results, null, 2)}</pre>
        </Grid>
      </Grid>
    </Grid>
  );
};
