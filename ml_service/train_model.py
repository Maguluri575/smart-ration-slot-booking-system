import os
import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report

def generate_synthetic_data(n_samples=1200):
    np.random.seed(42)
    
    # Districts (categorical)
    districts = ['D01_Hyderabad', 'D02_RangaReddy', 'D03_Medchal', 'D04_Nalgonda', 'D05_Warangal']
    district_choice = np.random.choice(districts, n_samples)
    
    # Family members (1 to 8)
    family_members = np.random.randint(1, 9, n_samples)
    
    # Monthly income (in INR)
    # Poorer households will have low income, richer will have high
    monthly_income = np.random.exponential(scale=12000, size=n_samples) + 800
    monthly_income = np.clip(monthly_income, 800, 75000).astype(int)
    
    # Gas connection (0 or 1, richer households more likely to have it)
    gas_prob = np.where(monthly_income < 3000, 0.15, 
                        np.where(monthly_income < 15000, 0.65, 0.95))
    gas_connection = np.random.binomial(1, gas_prob).astype(int)
    
    # Account status
    status = ['ACTIVE', 'SUSPENDED']
    account_status = np.random.choice(status, n_samples, p=[0.96, 0.04])
    
    # Quotas are generally determined by card type, but let's assign them with noise
    # Target card types:
    # AAY (Antyodaya Anna Yojana): Poor, high quotas (e.g. 35kg rice, 0-2kg wheat, 1kg sugar)
    # PHH (Priority House Hold): Middle, medium quotas (e.g. 6kg rice per person, 1-2kg wheat, 1kg sugar)
    # NPHH (Non-Priority House Hold): Richer, minimal quotas or inactive
    
    card_type = []
    rice_quota = []
    wheat_quota = []
    sugar_quota = []
    
    for i in range(n_samples):
        inc = monthly_income[i]
        fam = family_members[i]
        gas = gas_connection[i]
        
        # Rule-based generation with noise to make it clean but realistic
        if inc <= 2500 and gas == 0:
            # High probability of being AAY
            card = np.random.choice(['AAY', 'PHH'], p=[0.85, 0.15])
        elif inc <= 10000:
            # High probability of being PHH
            card = np.random.choice(['AAY', 'PHH', 'NPHH'], p=[0.10, 0.80, 0.10])
        else:
            # High probability of being NPHH
            card = np.random.choice(['PHH', 'NPHH'], p=[0.15, 0.85])
            
        card_type.append(card)
        
        # Assign quotas with noise based on card and family members
        if card == 'AAY':
            # AAY gets fixed quota of 35 kg rice, 2 kg wheat, 1 kg sugar
            rice = 35 + np.random.randint(-2, 3)
            wheat = 2 + np.random.randint(-1, 2)
            sugar = 1 + np.random.choice([0, 1], p=[0.7, 0.3])
        elif card == 'PHH':
            # PHH gets 6 kg rice per person, 1 kg wheat per person, 0.5 kg sugar per person
            rice = fam * 6 + np.random.randint(-1, 2)
            wheat = fam * 1 + np.random.randint(0, 2)
            sugar = 1 if fam > 4 else 0.5
        else: # NPHH
            # NPHH gets minimal quota (e.g. 2kg rice, 1kg wheat, 0 sugar)
            rice = np.random.choice([0, 2, 4], p=[0.5, 0.4, 0.1])
            wheat = np.random.choice([0, 1], p=[0.7, 0.3])
            sugar = 0
            
        rice_quota.append(max(0, rice))
        wheat_quota.append(max(0, wheat))
        sugar_quota.append(max(0, sugar))
        
    df = pd.DataFrame({
        'district': district_choice,
        'family_members': family_members,
        'monthly_income': monthly_income,
        'rice_quota': rice_quota,
        'wheat_quota': wheat_quota,
        'sugar_quota': sugar_quota,
        'gas_connection': gas_connection,
        'account_status': account_status,
        'card_type': card_type
    })
    
    return df

def train():
    print("Generating synthetic household dataset...")
    df = generate_synthetic_data(1500)
    
    X = df.drop('card_type', axis=1)
    y = df['card_type']
    
    # Split dataset
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    # Preprocessing pipeline
    categorical_features = ['district', 'account_status']
    numerical_features = ['family_members', 'monthly_income', 'rice_quota', 'wheat_quota', 'sugar_quota', 'gas_connection']
    
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), numerical_features),
            ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_features)
        ])
    
    # Full machine learning pipeline
    pipeline = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('classifier', RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42))
    ])
    
    print("Training Random Forest Classifier model...")
    pipeline.fit(X_train, y_train)
    
    # Evaluate
    y_pred = pipeline.predict(X_test)
    print("\nModel Evaluation Report:")
    print(classification_report(y_test, y_pred))
    
    # Save the pipeline
    current_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(current_dir, 'card_classifier.joblib')
    joblib.dump(pipeline, model_path)
    print(f"Model successfully saved to {model_path}")

if __name__ == '__main__':
    train()
