import pandas as pd
import numpy as np

# Set seed for reproducibility
np.random.seed(42)
n_samples = 100

# Generate features
data = {
    'experience': np.random.randint(1, 20, n_samples),
    'age': np.random.randint(22, 60, n_samples),
    'education': np.random.randint(12, 22, n_samples),
}

# Target: salary based on features + MORE NOISE (to show overfitting better)
data['target'] = (
    data['experience'] * 2000 +   
    data['age'] * 500 +             
    data['education'] * 1000 +      
    np.random.normal(0, 15000, n_samples)  # INCREASED noise from 5000 to 15000
)

# Create DataFrame
df = pd.DataFrame(data)

# Save to CSV
df.to_csv('raw_noisy.csv', index=False)

print("✅ Noisy dataset created successfully!")
print(f"📊 Shape: {df.shape}")
print("\n🔍 First 5 rows:")
print(df.head())
print("\n📈 Statistics:")
print(df.describe())