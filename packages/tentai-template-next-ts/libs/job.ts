// most should be sent via backend already

import { createJob } from "./bacalhau/bacalhau";

export const mapJobWithInput = (inputParmas: any) => {
  return createJob({
    docker: { image: "ubuntu", entrypoint: ["echo", "hello"] },
  });
};

// export const submitJobWithModel = (inputParmas: any) => {
//   return createJob({
//     docker: { image: "ubuntu", entrypoint: ["echo", "hello"] },
//   });
// };
