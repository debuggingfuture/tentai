# with pulumi up, we are able to get
# - image packing our  model
# - bacalhau job config
# - ipfs/spheron hosting the frontend

import pulumi

import pulumi_dcdk as dcdk

# use pre-built 
bacalhauJobImage = dcdk.BacalhauJobImage('model-image', image_name='docker.io/hackfs2023debuggingfuture/tentai-gradio-adapter-py:latest')
 
# build directly from docker template (slower) (./model)
# bacalhauJobImage = dcdk.BacalhauJobImage('model-image', image_name='docker.io/tentai-gradio-adapter-py:latest', custom_template='gradio-adapter-py')

site = dcdk.TentaiPage('tentai-shill-ai-page', site_template="tentai-template-next-ts", job_image_name=bacalhauJobImage.image_name)


