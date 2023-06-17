# https://gradio.app/interface-state/
import gradio as gr
import model.demo as app
from argparse import ArgumentParser

if __name__ == "__main__":
    parser = ArgumentParser(description="TENTAI runner")
    parser.add_argument('inputs', metavar='N', type=str, nargs='+',
                    help='inputs')
    args = parser.parse_args()
    # match the predict function per model
    # for demo, now we bundle everything together e.g. packages
    # we will hv optimized docker template for each model
    app.demo.predict(args.inputs[0], args.inputs[1], args.inputs[2])