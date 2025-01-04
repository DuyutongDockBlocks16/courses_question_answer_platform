from transformers import pipeline

generator = pipeline('text-generation', model="facebook/opt-125m", do_sample=True, max_new_tokens=200)
