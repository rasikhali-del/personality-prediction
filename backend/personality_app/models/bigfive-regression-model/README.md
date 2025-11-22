---
library_name: transformers
tags:
- big-five
- regression
- psychology
- transformer
- text-analysis
license: mit
datasets:
- jingjietan/essays-big5
language:
- en
---

# 🧠 Big Five Personality Regression Model

This model predicts Big Five personality traits — Openness, Conscientiousness, Extraversion, Agreeableness, and Neuroticism — from English free-text inputs. The output is a set of five continuous values between 0.0 and 1.0, corresponding to each trait.

---

## Model Details

### Model Description

- **Developed by:** [vladinc](https://huggingface.co/vladinc)
- **Model type:** `distilbert-base-uncased`, fine-tuned
- **Language(s):** English
- **License:** MIT
- **Finetuned from model:** `distilbert-base-uncased`
- **Trained on:** ~8,700 essays from the `jingjietan/essays-big5` dataset

### Model Sources

- **Repository:** [https://huggingface.co/vladinc/bigfive-regression-model](https://huggingface.co/vladinc/bigfive-regression-model)

---

## Uses

### Direct Use

This model can be used to estimate personality profiles from user-written text. It may be useful in psychological analysis, conversational profiling, or educational feedback systems.

### Out-of-Scope Use

- Not intended for clinical or diagnostic use.
- Should not be used to make hiring, legal, or psychological decisions.
- Not validated across cultures or demographic groups.

---

## Bias, Risks, and Limitations

- Trained on essay data; generalizability to tweets, messages, or other short-form texts may be limited.
- Traits like Extraversion and Neuroticism had higher validation MSE, suggesting reduced predictive reliability.
- Cultural and linguistic biases in training data may influence predictions.

### Recommendations

Do not use predictions from this model in isolation. Supplement with human judgment and/or other assessment tools.

---

## How to Get Started with the Model

```python
from transformers import AutoTokenizer, AutoModelForSequenceClassification

model = AutoModelForSequenceClassification.from_pretrained("vladinc/bigfive-regression-model")
tokenizer = AutoTokenizer.from_pretrained("vladinc/bigfive-regression-model")

text = "I enjoy reflecting on abstract concepts and trying new things."
inputs = tokenizer(text, return_tensors="pt")
outputs = model(**inputs)

print(outputs.logits)  # 5 float scores between 0.0 and 1.0

Training Details
Training Data
Dataset: jingjietan/essays-big5

Format: Essay text + 5 numeric labels for personality traits

Training Procedure
Epochs: 3

Batch size: 8

Learning rate: 2e-5

Loss Function: Mean Squared Error

Metric for Best Model: MSE on Openness

Evaluation
Metrics
Trait	Validation MSE
Openness	0.324
Conscientiousness	0.537
Extraversion	0.680
Agreeableness	0.441
Neuroticism	0.564

Citation
If you use this model, please cite it:

BibTeX:

bibtex
Copy
Edit
@misc{vladinc2025bigfive,
  title={Big Five Personality Regression Model},
  author={vladinc},
  year={2025},
  howpublished={\\url{https://huggingface.co/vladinc/bigfive-regression-model}}
}
Contact
If you have questions or suggestions, feel free to reach out via the Hugging Face profile.