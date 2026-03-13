from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import json
import os
from utils import handle_missing_values, get_eda_summary
from train import train_model

app = FastAPI()

# CORS - Allow all origins (fixed for any port)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global model cache to avoid retraining
trained_model = None
model_params = None

@app.get("/")
def read_root():
    return {"status": "API running"}

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        # Read CSV file
        contents = await file.read()
        
        # Ensure data directory exists
        data_dir = os.path.join(BASE_DIR, "../data")
        os.makedirs(data_dir, exist_ok=True)
        
        # Save to data folder
        raw_path = os.path.join(data_dir, "raw.csv")
        with open(raw_path, "wb") as f:
            f.write(contents)
        
        # Load with pandas
        df = pd.read_csv(raw_path)
        
        # Basic EDA
        eda = {
            "shape": list(df.shape),
            "columns": df.columns.tolist(),
            "dtypes": df.dtypes.astype(str).to_dict(),
            "missing_count": df.isnull().sum().to_dict(),
            "first_5_rows": df.head().to_dict('records')
        }
        
        return eda
    except Exception as e:
        return {"error": f"Upload failed: {str(e)}"}

@app.post("/clean")
async def clean_data(method: str = "mean"):
    try:
        # Load raw data
        raw_path = os.path.join(BASE_DIR, "../data/raw.csv")
        df = pd.read_csv(raw_path)
        
        # Clean
        df_clean = handle_missing_values(df, method=method)
        
        # Save cleaned data
        cleaned_path = os.path.join(BASE_DIR, "../data/cleaned.csv")
        df_clean.to_csv(cleaned_path, index=False)
        
        return {
            "message": "Data cleaned successfully",
            "cleaned_shape": list(df_clean.shape),
            "eda": get_eda_summary(df_clean)
        }
    except Exception as e:
        return {"error": f"Data cleaning failed: {str(e)}"}

@app.post("/train")
async def train_endpoint(
    model_type: str = "linear",
    target_col: str = "target",
    max_depth: int = 3,
    min_samples_leaf: int = 1
):
    global trained_model, model_params
    
    current_params = (model_type, target_col, max_depth, min_samples_leaf)
    
    try:
        # Check if model is already trained with same parameters
        if trained_model is None or model_params != current_params:
            results = train_model(
                model_type=model_type,
                target_col=target_col,
                max_depth=max_depth,
                min_samples_leaf=min_samples_leaf
            )
            trained_model = results
            model_params = current_params
        else:
            results = trained_model
        
        return results
    except Exception as e:
        return {
            "error": str(e),
            "message": "Training failed. Check if data is cleaned and target column exists."
        }