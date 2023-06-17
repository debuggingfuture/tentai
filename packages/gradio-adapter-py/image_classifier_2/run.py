import requests
import torch
from PIL import Image
from torchvision import transforms
from argparse import ArgumentParser
import os.path
import gradio as gr

model = torch.hub.load("pytorch/vision:v0.6.0", "resnet18", pretrained=True).eval()

# Download human-readable labels for ImageNet.
response = requests.get("https://git.io/JJkYN")
labels = response.text.split("\n")


def predict(inp):
    inp = Image.fromarray(inp.astype("uint8"), "RGB")
    inp = transforms.ToTensor()(inp).unsqueeze(0)
    with torch.no_grad():
        prediction = torch.nn.functional.softmax(model(inp)[0], dim=0)
    return {labels[i]: float(prediction[i]) for i in range(1000)}


inputs = gr.Image()
outputs = gr.Label(num_top_classes=3)

demo = gr.Interface(fn=predict, inputs=inputs, outputs=outputs)


parser = ArgumentParser(description="ikjMatrix multiplication")
parser.add_argument("-i", dest="filename", required=True,
                    help="input file with two matrices", metavar="FILE")
args = parser.parse_args()

print("image")
print(args.filename)

if __name__ == "__main__":
    demo.launch()
