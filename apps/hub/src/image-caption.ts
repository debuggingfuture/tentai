// https://huggingface.co/nlpconnect/vit-gpt2-image-captioning
class ImageCaptionStack {
  create() {
    const pipelines = ["translations"];

    //builder pattern/ decorators

    create()
    .service(    ImageCaptionService)
    .(    ImageCaptionPipelines)

  }


}
class ImageCaptionService {

    create(){

    }
    api() {
        return {
          fn: "predict",
          inputs: "text",
        };
      }
}

class ImageCaptionPipelines {

    create(){

    }

}

class ImageCaptionWidget {

    create(){
        createWith(
            {
                provider: 'gradio',
                script: 'index.py'
            }
        )

    }
}

// where to image

// model = VisionEncoderDecoderModel.from_pretrained("nlpconnect/vit-gpt2-image-captioning")
// feature_extractor = ViTImageProcessor.from_pretrained("nlpconnect/vit-gpt2-image-captioning")
// tokenizer = AutoTokenizer.from_pretrained("nlpconnect/vit-gpt2-image-captioning")


