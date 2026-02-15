import pandas as pd
import numpy as np

def handle_missing_values(df, method="drop"):
    """
    Handle missing values in dataframe
    method: 'drop', 'mean', 'median', 'mode'
    """
    df_clean = df.copy()
    
    if method == "drop":
        df_clean = df_clean.dropna()
    elif method == "mean":
        for col in df_clean.select_dtypes(include=[np.number]).columns:
            df_clean[col].fillna(df_clean[col].mean(), inplace=True)
    elif method == "median":
        for col in df_clean.select_dtypes(include=[np.number]).columns:
            df_clean[col].fillna(df_clean[col].median(), inplace=True)
    elif method == "mode":
        for col in df_clean.columns:
            if len(df_clean[col].mode()) > 0:
                df_clean[col].fillna(df_clean[col].mode()[0], inplace=True)
    
    return df_clean

def get_eda_summary(df):
    """Get exploratory data analysis summary"""
    return {
        "shape": list(df.shape),
        "columns": df.columns.tolist(),
        "dtypes": df.dtypes.astype(str).to_dict(),
        "missing_count": df.isnull().sum().to_dict(),
        "first_5_rows": df.head().to_dict('records')
    }