# with pulumi up, we are able to get
# image packing our python
# bacalhau job
# docker hosting the page 

import pulumi

import pulumi_dcdk as dcdk


# page = dcdk.IpfsStaticPage('some-page', index_content="Hello, world!")


# site = dcdk.Tentai('some-spheron-page', folder_path="dummy")

# only tentai shd be template1
site = dcdk.SpheronStaticPage('some-spheron-page', folder_path="dummy")


# bacalhauJobImage = dcdk.BacalhauJobImage('job-image', image_name='ubuntu:latest')


bacalhauJobImage = dcdk.BacalhauJobImage('job-image-2', image_name='docker.io/tentai-gradio-adapter-py:latest', custom_template='gradio-adapter-py')