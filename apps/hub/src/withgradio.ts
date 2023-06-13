
import { client, type SpaceStatus } from "@gradio/client";

const app = await client("user/space-name", {
  // The space_status parameter does not need to be manually annotated, this is just for illustration.
  space_status: (space_status: SpaceStatus) => console.log(space_status),
});