import type { ReactElement } from "react";

const Page = () => {
  // requires SW, will not work for SSR
  fetch(
    "/ipfs/bafybeiezf6xps7inljwgpgltv75fbjgf5ov7wka3kqxvj34flgkic7o7we/export-detail.json"
  )
    .then((res) => res.text())
    .then((data) => {
      console.log("data", data);
    });

  return <p>hello world</p>;
};

export default Page;
