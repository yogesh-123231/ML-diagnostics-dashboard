# ML Training Diagnostics Dashboard

## Summary
A web dashboard that trains ML models and automatically detects overfitting/underfitting through metrics analysis and diagnostics.

## Tech Stack
**Backend:** FastAPI  
**ML libs:** scikit-learn, pandas, numpy  
**Frontend:** React

## How to Run

### Backend:
```bash
cd backend
pip install -r requirements.txt
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

### Frontend:
```bash
cd frontend
npm install
npm start
```

Access at: `http://localhost:3000`

## Data
- Place raw dataset in `/data/raw.csv`
- Cleaning produces `/data/cleaned.csv`
- Sample dataset: Salary prediction (experience, age, education → salary)

## Features
1. **Data Upload & EDA** - CSV upload with automatic summary
2. **Preprocessing** - Missing value imputation (mean/median/mode)
3. **Model Training** - Linear Regression & Decision Tree
4. **Diagnostics** - Automated overfitting/underfitting detection
5. **Logging** - JSON logs with metrics and hyperparameters

## Usage
1. Upload CSV file
2. Clean data (mean imputation)
3. Select model type and hyperparameters
4. Train model
5. Review metrics (MSE, R²) and diagnostics

## Week-wise Concept Mapping
- **Week 1:** Python modular code, functions, file handling
- **Week 2:** Data cleaning, missing values handling with pandas
- **Week 3:** Cost function (MSE) & gradient intuition
- **Week 4:** Bias-variance tradeoff, overfitting/underfitting detection
- **Week 5:** Hyperparameter experiments (max_depth tuning)
- **Week 6:** Loss curves & training diagnostics

## Project Structure
```
ml-diagnostics-dashboard/
├── backend/
│   ├── app.py              # FastAPI endpoints
│   ├── utils.py            # Data cleaning
│   ├── train.py            # Model training & diagnostics
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.js
│   │   └── components/UploadForm.jsx
│   └── package.json
├── data/
│   ├── raw.csv
│   └── cleaned.csv
├── logs/
│   └── training_*.json
├── README.md
└── training_analysis.md
```

## Key Learnings
- **Multi-signal diagnostics:** Combined MSE ratios and R² scores for accurate overfitting detection
- **Data quality matters:** Cleaning and validation are essential before training
- **Model complexity tradeoff:** Deeper trees risk overfitting; simpler models often win
- **Reproducibility:** Fixed random seeds and logging enable consistent results

## Note on Loss Curves
Loss curves (plotting loss over training epochs) are relevant for iterative models like Neural Networks. 
Since this project uses Linear Regression and Decision Trees (which train in a single pass), 
we display final metrics (train/val/test MSE and R²) instead, which effectively demonstrate 
overfitting/underfitting without requiring epoch-by-epoch visualization.

## Troubleshooting
- **CORS errors:** Ensure backend allows all origins: `allow_origins=["*"]`
- **Port conflicts:** React will prompt for alternate port - press `Y`
- **Training fails:** Verify CSV has `target` column and data is cleaned

## Visualization Approach

**Metrics Display:** Train/Validation/Test metrics shown in tabular format for clear comparison.

**Why no epoch-by-epoch loss curves?** 
Loss curves plot training progress over multiple epochs, which is relevant for iterative models 
(Neural Networks, Gradient Descent-based algorithms). Linear Regression and Decision Trees 
train in a single pass, so we display final metrics instead, which directly demonstrate 
the bias-variance tradeoff and overfitting detection.

**Alternative visualization:** Consider adding learning curves (model performance vs dataset size) 
in future versions for deeper analysis.

## Author
Created for CreativeARC Services Pvt Ltd ML Internship Program