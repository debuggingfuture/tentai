class BertStack {
  create() {
    const pipelines = ["translations"];
  }

  api() {
    return {
      fn: "predict",
      inputs: "text",
    };
  }
}

// deploy with docker
