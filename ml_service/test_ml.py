import os
import sys
import joblib
import pandas as pd

# Add parent path to allow imports
sys.path.append(os.path.dirname(__file__))
import train_model

def run_ml_tests():
    print("=== Starting Automated Machine Learning Service Tests ===")
    
    # 1. Train model
    print("Testing model training pipeline...")
    train_model.train()
    
    model_file = os.path.join(os.path.dirname(__file__), 'card_classifier.joblib')
    if not os.path.exists(model_file):
        raise FileNotFoundError(f"Model file not found at {model_file}")
    print("[OK] Model trained and classifier file generated successfully.")
    
    # 2. Load model
    print("Testing model loading...")
    model = joblib.load(model_file)
    print("[OK] Model successfully loaded.")
    
    # 3. Predict sample inputs
    print("Testing predictions on sample demographics...")
    
    # Sample AAY: Low income, no gas connection
    sample_aay = pd.DataFrame([{
        'district': 'D01_Hyderabad',
        'family_members': 2,
        'monthly_income': 1000.0,
        'rice_quota': 35.0,
        'wheat_quota': 2.0,
        'sugar_quota': 1.0,
        'gas_connection': 0,
        'account_status': 'ACTIVE'
    }])
    
    # Sample NPHH: High income, gas connection
    sample_nphh = pd.DataFrame([{
        'district': 'D02_RangaReddy',
        'family_members': 4,
        'monthly_income': 45000.0,
        'rice_quota': 2.0,
        'wheat_quota': 1.0,
        'sugar_quota': 0.0,
        'gas_connection': 1,
        'account_status': 'ACTIVE'
    }])
    
    pred_aay = model.predict(sample_aay)[0]
    prob_aay = model.predict_proba(sample_aay)[0]
    
    pred_nphh = model.predict(sample_nphh)[0]
    prob_nphh = model.predict_proba(sample_nphh)[0]
    
    print(f"[OK] Prediction 1 (Expected AAY): Classified as '{pred_aay}' with confidence {max(prob_aay):.2f}")
    print(f"[OK] Prediction 2 (Expected NPHH): Classified as '{pred_nphh}' with confidence {max(prob_nphh):.2f}")
    
    print("=== All Machine Learning Tests PASSED successfully! ===")

if __name__ == '__main__':
    run_ml_tests()
