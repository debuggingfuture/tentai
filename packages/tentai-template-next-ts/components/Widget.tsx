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
import LinearProgress from "@mui/material/LinearProgress";
import { TextareaAutosize } from "@mui/base";
import {
  Button,
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
  TextField,
  Typography,
} from "@mui/material";
import { submitJob } from "../libs/bacalhau/bacalhau";
import { fetchWithSaturn } from "../libs/saturn";
import styled from "@emotion/styled";
import { mapJobWithModelInput, ModelConfig } from "../libs/job";

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
  value?: string;
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
  return <TextareaAutosize sx={{ minWidth: "400px" }} minRows={20} {...rest} />;
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
  title,
}: {
  components: TentaiUiComponent[];
  title: string;
}) => {
  return (
    <>
      {components.map((component, i) => {
        const strategy = RENDER_STRATEGIES[component.componentType];
        return (
          <Grid key={component.componentType + "-" + i} item xs={12}>
            {/* {(component as Input).label && (
              <InputLabel htmlFor="my-input">input</InputLabel>
            )} */}
            <Typography style={{ color: "black" }} variant="h6">
              {title}
            </Typography>
            {strategy(component)}
          </Grid>
        );
      })}
    </>
  );
};

export const StyledCodeBlock = styled.pre`
  margin: 1px;
  background-color: #000;
  overflow: auto;
`;

export const showProgress = (progress: number) => {
  if (progress === 100) {
    return <div>Done!🌟</div>;
  }
  if (progress > 0) {
    return (
      <div>
        Loading...✨✨✨
        <LinearProgress />
      </div>
    );
  }
  return <></>;
};

export const Widget = ({ modelConfig, renderConfig }: WidgetProps) => {
  const [bacalhauTask, setBacalhauTask] = React.useState({
    ...modelConfig,
    results: {},
  });
  const [bacalhauProgress, setBacalhauProgress] = React.useState(0);
  const [results, setResults] = React.useState({});
  const [inputs, setInputs] = React.useState(renderConfig.inputs.map((a) => a));
  const [outputs, setOutputs] = React.useState(renderConfig.outputs);

  React.useEffect(() => {
    (async () => {
      const job = bacalhauTask?.job;
      console.log("raw", modelConfig, job);
      //@ts-ignore
      if (!job?.docker?.entrypoint) {
        return;
      }
      console.log("job updated", job);
      const bacalhauResults = await submitJob(job).catch((err) => {
        console.log("err", err);
      });
      // TODO add event. now just dismis it
      console.log("bacalhauResults", bacalhauResults);
      setBacalhauProgress(100);
      setBacalhauTask({
        ...bacalhauTask,
        results: bacalhauResults,
      });
      const cid = bacalhauResults?.cid!;

      if (cid) {
        // TODO by  resultTypes : ["text", "image"] and multiple
        const rawResults = await fetchWithSaturn("/ipfs/" + cid + "/stdout");
        const text = await rawResults.text();
        const results = [text];
        setResults(results);

        // TODO use _.zipWith
        setOutputs(
          outputs.map((output, i) => {
            return {
              ...output,
              value: results?.[i],
            };
          })
        );
      }
    })();
    //@ts-ignore
  }, [bacalhauTask.job?.docker?.entrypoint]);

  return (
    <Grid container spacing={2} justifyContent="space-around">
      <Grid
        item
        container
        xs={5}
        justifyContent="end"
        borderRadius="20px"
        sx={{ margin: 2, padding: 2, backgroundColor: "white", width: "100%" }}
      >
        <ComponentsGrid title="input" components={renderConfig.inputs} />
        <Grid item xs={2}>
          <Button
            onClick={async () => {
              console.log("submitJob", renderConfig, inputs);
              setBacalhauProgress(10);
              const job = await mapJobWithModelInput(modelConfig, {
                inputs: inputs.map((input, i) => ({
                  type: "text",
                  // value: inputs[0],
                  // onValueChange: (event: any) => {
                  //   input.value = event.target.value;
                  //   const updated = inputs;
                  //   updated[i].value = event.target.value;
                  //   setInputs(updated);
                  // },
                  value:
                    "HackFS 2023 is an event bringing together some of the top minds and experts in Ethereum Ecosystem. We enable teams to make something great in only 3 weeks by providing an abundance of web3 resources like mentors, sponsors, and software.",
                })),
              });
              console.log("job confirmed", job);
              setBacalhauTask({
                ...bacalhauTask,
                // @ts-ignore
                job,
                resultTypes: modelConfig.resultTypes,
              });
            }}
          >
            Submit
          </Button>
        </Grid>
      </Grid>

      <Grid
        item
        container
        xs={5}
        justifyContent="end"
        borderRadius="20px"
        sx={{ margin: 2, padding: 2, backgroundColor: "white", width: "100%" }}
      >
        <ComponentsGrid title="output" components={outputs} />
      </Grid>

      <Grid item container xs={12}>
        <Grid item xs={12} justifyContent="center" alignItems="center">
          {showProgress(bacalhauProgress)}
        </Grid>
        <Grid container item xs={12} spacing={1} justifyContent="space-around">
          <Grid item xs={12}>
            <h3>Bacalhau results</h3>
            raw:
          </Grid>

          <Grid item xs={5}>
            <StyledCodeBlock>
              Job
              <div>{JSON.stringify(bacalhauTask?.job, null, 2)}</div>
            </StyledCodeBlock>
          </Grid>
          <Grid item xs={5}>
            <StyledCodeBlock>
              Results
              <div>{JSON.stringify(bacalhauTask?.results, null, 2)}</div>
            </StyledCodeBlock>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <h3>Parsed results</h3>
          raw:
          <StyledCodeBlock>
            <div>{JSON.stringify(results, null, 2)}</div>
          </StyledCodeBlock>
        </Grid>
      </Grid>
    </Grid>
  );
};
