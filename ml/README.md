# BizMind – Machine Learning Microservice Architecture

## Overview
BizMind's predictive intelligence service is designed as an isolated microservice using Python, FastAPI, and Scikit-Learn.

## Directory Structure
- `data/`: Raw and processed dataset files for training business survival models.
- `models/`: Joblib serialized model artifacts (Random Forest & Gradient Boosting).
- `notebooks/`: Exploratory data analysis, feature engineering, and model evaluation workflows.
- `src/`:
  - `main.py`: FastAPI server exposing `/health` and `/predict` endpoints.
  - `predictor.py`: Machine learning pipeline and inference execution logic.
  - `requirements.txt`: Python package specifications.

## Setup Instructions
```bash
cd ml
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r src/requirements.txt
uvicorn src.main:app --port 8000 --reload
```
