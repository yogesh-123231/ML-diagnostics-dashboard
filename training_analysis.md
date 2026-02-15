# Training Analysis Report

## Dataset
- **Name:** Salary Prediction Dataset
- **Size:** 93 rows × 4 columns
- **Features:** experience, age, education
- **Target:** salary (dollars)
- **Missing Values:** None

## Preprocessing
- **Method:** Mean imputation (default)
- **Output:** cleaned.csv saved to /data/

---

## Experiment 1: Linear Regression (Baseline)

### Configuration
- Model: Linear Regression
- Random State: 42
- Split: 60% train / 16% val / 24% test

### Results
| Dataset | MSE | R² |
|---------|-----|-----|
| Train | 905,021 | 0.9984 |
| Validation | 2,111,735 | 0.9951 |
| Test | 1,455,261 | 0.9975 |

### Analysis
✅ **Well-fitted model** - Excellent R² scores (>0.99) across all datasets. MSE ratio of 2.3x is acceptable with minimal R² drop (0.003). Simple linear model captures patterns effectively.

---

## Experiment 2: Decision Tree (depth=3)

### Configuration
- Model: Decision Tree Regressor
- max_depth: 3
- min_samples_leaf: 1
- Random State: 42

### Results
| Dataset | MSE | R² |
|---------|-----|-----|
| Train | 9,773,709 | 0.9824 |
| Validation | 15,871,401 | 0.9630 |
| Test | 12,711,484 | 0.9778 |

### Analysis
✅ **Well-fitted model** - Controlled depth prevents overfitting. Slightly worse than linear regression but still generalizes well (R² > 0.96).

---

## Experiment 3: Decision Tree (depth=15)

### Configuration
- Model: Decision Tree Regressor
- max_depth: 15 (intentionally high)
- Random State: 42

### Results
| Dataset | MSE | R² |
|---------|-----|-----|
| Train | 64,972 | 0.9999 |
| Validation | 5,200,000 | 0.9879 |
| Test | 4,697,368 | 0.9918 |

### Analysis
⚠️ **Overfitting detected** - Training MSE extremely low (64k) but validation MSE 80x higher (5.2M). Model memorizes training data. Despite high R² scores, MSE ratio indicates overfitting.

---

## Model Comparison

| Model | Depth | Train MSE | Val MSE | Test MSE | Overfitting? |
|-------|-------|-----------|---------|----------|--------------|
| Linear Regression | N/A | 905k | 2.1M | 1.5M | No ✅ |
| Decision Tree | 3 | 9.8M | 15.9M | 12.7M | No ✅ |
| Decision Tree | 15 | 65k | 5.2M | 4.7M | Yes ⚠️ |

---

## Best Model
**Winner: Linear Regression**
- Lowest validation/test MSE
- Highest R² scores
- Simplest model (fast, interpretable)
- No overfitting

---

## Diagnostic System Performance

### What Works
✅ Multi-metric detection (MSE + R²)  
✅ Severity classification (moderate vs severe)  
✅ Actionable recommendations  
✅ Automated logging  

### Lessons Learned
1. **Simple often wins** - Linear model outperformed complex trees
2. **Multiple metrics needed** - R² alone can mask overfitting
3. **Depth matters** - depth=15 clearly overfits on 93 samples
4. **Fixed seeds work** - Perfect reproducibility across runs

---

## Conclusion
Successfully built end-to-end ML diagnostic system that:
- Preprocesses data with validation
- Trains multiple models with configurable hyperparameters
- Detects overfitting using MSE ratios and R² analysis
- Logs all experiments for reproducibility

All logs saved to `/logs/training_*.json`