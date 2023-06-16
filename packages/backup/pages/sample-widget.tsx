import { TentaiUiComponentType, Widget } from "@/components/Widget";
import { Container } from "@mui/material";
import Image from "next/image";

const config = {
  job: {
    docker: { image: "ubuntu", entrypoint: ["echo", "hello"] },
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

export default function SampleWidget() {
  return (
    <Container sx={{ m: 10 }}>
      <Widget renderConfig={config.renderConfig}></Widget>
    </Container>
  );
}
