# with pulumi up, we are able to get
# image packing our python
# bacalhau job
# docker hosting the page 

import pulumi

import pulumi_dcdk as dcdk


site = dcdk.TentaiPage('some-spheron-page', custom_template="tentai-template-next-ts")

# deploy from template
site = dcdk.SpheronStaticPage('demo-site', folder_path="")


# pre-built
bacalhauJobImage = dcdk.BacalhauJobImage('model-image', image_name='docker.io/hackfs2023debuggingfuture/tentai-gradio-adapter-py:latest')

# build directly from docker template
# bacalhauJobImage = dcdk.BacalhauJobImage('model-image', image_name='docker.io/tentai-gradio-adapter-py:latest', custom_template='gradio-adapter-py')