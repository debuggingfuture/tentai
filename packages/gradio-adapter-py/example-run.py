import image_classifier_2.run as image_classifier
import question_answering as question_answering
from gradio.context import Context

#  load() and other events can only be called within a Blocks context.

print(image_classifier)
print("predict")
print(image_classifier.predict)

source = image_classifier.demo

with source as demo:
    # results = demo.load()
    print(demo.blocks)
    print("---")
    print(demo.dependencies)

    config = {
        "inputs": [ 
            
        ]
    }
