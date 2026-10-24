import os
import sys
import joblib
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing for backend integration

MODEL_PATH = os.path.join(os.path.dirname(__file__), 'card_classifier.joblib')
model = None

def load_or_train_model():
    global model
    if os.path.exists(MODEL_PATH):
        try:
            print(f"Loading trained classifier model from {MODEL_PATH}...")
            model = joblib.load(MODEL_PATH)
            print("Model loaded successfully!")
        except Exception as e:
            print(f"Error loading model: {e}. Retraining...")
            model = None
            
    if model is None:
        print("Classifier model not found or failed to load. Initiating training...")
        try:
            # Add current directory to path to import train_model
            sys.path.append(os.path.dirname(__file__))
            import train_model
            train_model.train()
            model = joblib.load(MODEL_PATH)
            print("Model trained and loaded successfully!")
        except Exception as e:
            print(f"Critical error training model: {e}")

@app.route('/predict', methods=['POST'])
def predict():
    global model
    if model is None:
        load_or_train_model()
        if model is None:
            return jsonify({'error': 'Machine learning model is not available.'}), 500
            
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No input data provided.'}), 400
            
        # Parse inputs
        required_fields = ['district', 'family_members', 'monthly_income', 'rice_quota', 'wheat_quota', 'sugar_quota', 'gas_connection', 'account_status']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing field: {field}'}), 400
                
        # Create DataFrame from input data (must match features of training data)
        input_data = pd.DataFrame([{
            'district': str(data['district']),
            'family_members': int(data['family_members']),
            'monthly_income': float(data['monthly_income']),
            'rice_quota': float(data['rice_quota']),
            'wheat_quota': float(data['wheat_quota']),
            'sugar_quota': float(data['sugar_quota']),
            'gas_connection': int(data['gas_connection']),
            'account_status': str(data['account_status'])
        }])
        
        # Predict card type
        prediction = model.predict(input_data)[0]
        probabilities = model.predict_proba(input_data)[0]
        classes = model.classes_
        
        # Build confidence scores
        confidences = {classes[i]: float(probabilities[i]) for i in range(len(classes))}
        confidence = float(max(probabilities))
        
        return jsonify({
            'prediction': prediction,
            'confidence': confidence,
            'probabilities': confidences,
            'note': 'ML prediction is for classification demonstration purposes. Official status requires government verification.'
        })
        
    except Exception as e:
        return jsonify({'error': f'Prediction failed: {str(e)}'}), 500

@app.route('/train', methods=['POST'])
def retrain():
    global model
    try:
        sys.path.append(os.path.dirname(__file__))
        import train_model
        train_model.train()
        model = joblib.load(MODEL_PATH)
        return jsonify({'status': 'Success', 'message': 'Random Forest model retrained successfully!'})
    except Exception as e:
        return jsonify({'status': 'Failed', 'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None,
        'features': [
            'district', 'family_members', 'monthly_income', 'rice_quota', 
            'wheat_quota', 'sugar_quota', 'gas_connection', 'account_status'
        ]
    })

if __name__ == '__main__':
    load_or_train_model()
    # Run the Flask app on port 5000
    app.run(host='0.0.0.0', port=5000, debug=False)
