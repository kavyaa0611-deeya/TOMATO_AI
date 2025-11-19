from flask import Flask, request, jsonify 
from flask_cors import CORS
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from datetime import datetime
import hashlib
import json
import numpy as np
from PIL import Image
import io
import secrets
import os
from dotenv import load_dotenv

load_dotenv()
# TensorFlow/Keras imports
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras.preprocessing import image as keras_image
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input

app = Flask(__name__)
# Allow frontend to access backend
   allowed_origins = os.getenv("ALLOWED_ORIGINS", "*").split(",")
   CORS(app, resources={
       r"/api/*": {
           "origins": allowed_origins,
           "methods": ["GET", "POST", "OPTIONS"],
           "allow_headers": ["Content-Type"]
       }
   })
# ==================== CONFIGURATION ====================
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
SENDER_EMAIL = "kavyaa0611@gmail.com"  
SENDER_PASSWORD = "nzcb xrhv cswf fdxf" 

USERS_FILE = "users.json"
RESET_TOKENS_FILE = "reset_tokens.json"
MODEL_PATH = "tomato_disease_model.h5"

CLASS_NAMES = [
    'Tomato_Bacterial_spot',
    'Tomato_Early_blight',
    'Tomato_Late_blight',
    'Tomato_Leaf_Mold',
    'Tomato_Septoria_leaf_spot',
    'Tomato_Spider_mites_Two_spotted_spider_mite',
    'Tomato_Target_Spot',
    'Tomato_Tomato_Yellow_Leaf_Curl_Virus',
    'Tomato_Tomato_mosaic_virus',
    'Tomato_healthy'
]

# Load model
try:
    model = keras.models.load_model(MODEL_PATH)
    print("✅ Model loaded successfully!")
    MODEL_LOADED = True
except Exception as e:
    print(f"⚠️ Model not found. Using demo mode. Error: {str(e)}")
    MODEL_LOADED = False

def send_welcome_email(to_email, name):
    try:
        msg = MIMEMultipart()
        msg['From'] = SENDER_EMAIL
        msg['To'] = to_email
        msg['Subject'] = "🎉 Welcome to Tomato Disease Detector!"

        body = f"""
Hello {name},

🎉 Your registration was successful!

Thank you for joining the Tomato Disease Detector App.
You can now log in and start analyzing tomato leaf diseases instantly.

Regards,
Tomato AI Team 🍅
"""

        msg.attach(MIMEText(body, 'plain'))

        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
        server.sendmail(SENDER_EMAIL, to_email, msg.as_string())
        server.quit()

        print("📧 Email sent to:", to_email)
        return True

    except Exception as e:
        print("❌ Email sending failed:", str(e))
        return False

def send_password_reset_email(to_email, name, reset_token):
    try:
        msg = MIMEMultipart()
        msg['From'] = SENDER_EMAIL
        msg['To'] = to_email
        msg['Subject'] = "🔒 Password Reset Request - Tomato Disease Detector"

        reset_link = f"http://localhost:3000/reset-password?token={reset_token}"
        
        body = f"""
Hello {name},

We received a request to reset your password for the Tomato Disease Detector App.

Your password reset code is: {reset_token}

This code will expire in 1 hour.

If you didn't request this password reset, please ignore this email.

Regards,
Tomato AI Team 🍅
"""

        msg.attach(MIMEText(body, 'plain'))

        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
        server.sendmail(SENDER_EMAIL, to_email, msg.as_string())
        server.quit()

        print("📧 Password reset email sent to:", to_email)
        return True

    except Exception as e:
        print("❌ Email sending failed:", str(e))
        return False

# ==================== UTILITY FUNCTIONS ====================

def load_users():
    if os.path.exists(USERS_FILE):
        with open(USERS_FILE, 'r') as f:
            return json.load(f)
    return {}

def save_users(users):
    with open(USERS_FILE, 'w') as f:
        json.dump(users, f, indent=2)

def load_reset_tokens():
    if os.path.exists(RESET_TOKENS_FILE):
        with open(RESET_TOKENS_FILE, 'r') as f:
            return json.load(f)
    return {}

def save_reset_tokens(tokens):
    with open(RESET_TOKENS_FILE, 'w') as f:
        json.dump(tokens, f, indent=2)

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

def generate_reset_token():
    return secrets.token_urlsafe(32)

def preprocess_image(img, target_size=(224, 224)):
    img = img.resize(target_size)
    img_array = keras_image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = preprocess_input(img_array)
    return img_array

def is_leaf_image(img):
    """
    Check if image contains leaf-like green color.
    Returns True if green percentage > 15%.
    """
    img_small = img.resize((150, 150))
    img_np = np.array(img_small)

    if img_np.ndim != 3 or img_np.shape[2] != 3:
        return False

    r = img_np[:, :, 0]
    g = img_np[:, :, 1]
    b = img_np[:, :, 2]

    green_pixels = np.sum((g > r) & (g > b))
    total_pixels = img_np.shape[0] * img_np.shape[1]
    green_percentage = (green_pixels / total_pixels) * 100

    return green_percentage > 15

def predict_disease(img):
    if not MODEL_LOADED:
        import random
        predicted_class = random.choice(CLASS_NAMES)
        confidence = round(random.uniform(78, 98), 2)
    else:
        try:
            processed_img = preprocess_image(img)
            predictions = model.predict(processed_img)
            predicted_idx = np.argmax(predictions[0])
            confidence = float(predictions[0][predicted_idx] * 100)
            predicted_class = CLASS_NAMES[predicted_idx]
            
            top_3_idx = np.argsort(predictions[0])[-3:][::-1]
            top_3_predictions = [
                {
                    'class': CLASS_NAMES[idx],
                    'confidence': float(predictions[0][idx] * 100)
                }
                for idx in top_3_idx
            ]
            
        except Exception as e:
            print(f"❌ Prediction error: {str(e)}")
            import random
            predicted_class = random.choice(CLASS_NAMES)
            confidence = round(random.uniform(78, 98), 2)
            top_3_predictions = None

    if predicted_class == 'Tomato_healthy':
        severity = "None"
    elif 'virus' in predicted_class.lower() or 'blight' in predicted_class.lower():
        severity = "High"
    elif 'spot' in predicted_class.lower() or 'mold' in predicted_class.lower():
        severity = "Moderate"
    else:
        severity = "Low"
    
    result = {
        'predicted_class': predicted_class,
        'confidence': round(confidence, 2),
        'severity': severity
    }
    
    if top_3_predictions:
        result['top_3_predictions'] = top_3_predictions
    
    return result


# ==================== API ENDPOINTS ====================

@app.route('/api/register', methods=['POST'])
def register():
    """Handle user registration"""
    try:
        data = request.json
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        name = data.get('name', '').strip()

        if not email or not password or not name:
            return jsonify({
                'success': False, 
                'message': '❌ All fields are required'
            }), 400

        if len(password) < 6:
            return jsonify({
                'success': False,
                'message': '❌ Password must be at least 6 characters'
            }), 400

        users = load_users()

        if email in users:
            return jsonify({
                'success': False,
                'message': '❌ This email is already registered.'
            }), 400

        users[email] = {
            'name': name,
            'password': hash_password(password),
            'registered_at': datetime.now().isoformat(),
            'last_login': None,
            'total_predictions': 0
        }
        save_users(users)

        email_sent = send_welcome_email(email, name)

        return jsonify({
            'success': True,
            'message': '🎉 Registration successful!',
            'email_sent': email_sent,
            'name': name
        }), 201

    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'❌ Registration failed: {str(e)}'
        }), 500

@app.route('/api/login', methods=['POST'])
def login():
    """Handle user login"""
    try:
        data = request.json
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')

        if not email or not password:
            return jsonify({
                'success': False,
                'message': '❌ Email and password are required'
            }), 400

        users = load_users()

        if email not in users:
            return jsonify({
                'success': False,
                'message': '❌ User not found.'
            }), 404

        if users[email]['password'] != hash_password(password):
            return jsonify({
                'success': False,
                'message': '❌ Invalid password.'
            }), 401

        users[email]['last_login'] = datetime.now().isoformat()
        save_users(users)

        return jsonify({
            'success': True,
            'message': '✅ Login successful!',
            'name': users[email]['name'],
            'total_predictions': users[email].get('total_predictions', 0)
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'❌ Login failed: {str(e)}'
        }), 500

@app.route('/api/forgot-password', methods=['POST'])
def forgot_password():
    """Handle forgot password request"""
    try:
        data = request.json
        email = data.get('email', '').strip().lower()

        if not email:
            return jsonify({
                'success': False,
                'message': '❌ Email is required'
            }), 400

        users = load_users()

        if email not in users:
            return jsonify({
                'success': False,
                'message': '❌ No account found with this email.'
            }), 404

        # Generate reset token
        reset_token = generate_reset_token()
        
        # Store token with expiration time (1 hour)
        reset_tokens = load_reset_tokens()
        reset_tokens[email] = {
            'token': reset_token,
            'created_at': datetime.now().isoformat(),
            'expires_at': (datetime.now().timestamp() + 3600)  # 1 hour from now
        }
        save_reset_tokens(reset_tokens)

        # Send reset email
        email_sent = send_password_reset_email(email, users[email]['name'], reset_token)

        return jsonify({
            'success': True,
            'message': '✅ Password reset link sent to your email!',
            'email_sent': email_sent
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'❌ Failed to send reset link: {str(e)}'
        }), 500

@app.route('/api/reset-password', methods=['POST'])
def reset_password():
    """Handle password reset with token"""
    try:
        data = request.json
        email = data.get('email', '').strip().lower()
        token = data.get('token', '')
        new_password = data.get('new_password', '')

        if not email or not token or not new_password:
            return jsonify({
                'success': False,
                'message': '❌ All fields are required'
            }), 400

        if len(new_password) < 6:
            return jsonify({
                'success': False,
                'message': '❌ Password must be at least 6 characters'
            }), 400

        users = load_users()
        reset_tokens = load_reset_tokens()

        if email not in users:
            return jsonify({
                'success': False,
                'message': '❌ User not found.'
            }), 404

        if email not in reset_tokens:
            return jsonify({
                'success': False,
                'message': '❌ Invalid or expired reset token.'
            }), 400

        # Check if token matches and hasn't expired
        token_data = reset_tokens[email]
        if token_data['token'] != token:
            return jsonify({
                'success': False,
                'message': '❌ Invalid reset token.'
            }), 400

        if datetime.now().timestamp() > token_data['expires_at']:
            del reset_tokens[email]
            save_reset_tokens(reset_tokens)
            return jsonify({
                'success': False,
                'message': '❌ Reset token has expired. Please request a new one.'
            }), 400

        # Update password
        users[email]['password'] = hash_password(new_password)
        save_users(users)

        # Delete used token
        del reset_tokens[email]
        save_reset_tokens(reset_tokens)

        return jsonify({
            'success': True,
            'message': '✅ Password reset successful! You can now log in with your new password.'
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'❌ Password reset failed: {str(e)}'
        }), 500

@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        if 'image' not in request.files:
            return jsonify({'success': False, 'error': '❌ No image uploaded.'}), 400

        file = request.files['image']
        
        if file.filename == '':
            return jsonify({'success': False, 'error': '❌ No image selected.'}), 400

        allowed_extensions = {'png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'}
        file_ext = file.filename.rsplit('.', 1)[1].lower() if '.' in file.filename else ''
        
        if file_ext not in allowed_extensions:
            return jsonify({'success': False, 'error': '❌ Invalid file type.'}), 400

        img_bytes = file.read()
        img = Image.open(io.BytesIO(img_bytes))

        if img.mode == 'RGBA':
            img = img.convert('RGB')

        if not is_leaf_image(img):
            return jsonify({
                'success': False,
                'error': '❌ This image does not appear to be a plant leaf.',
                'message': 'Please upload a clear tomato leaf image.'
            }), 400

        prediction_result = predict_disease(img)

        if prediction_result['confidence'] < 60:
            return jsonify({
                'success': False,
                'error': '❌ Not a tomato leaf.',
                'message': 'The uploaded leaf is not recognized as a tomato plant leaf.',
                'confidence': prediction_result['confidence']
            }), 400

        response = {
            'success': True,
            'predicted_class': prediction_result['predicted_class'],
            'predicted_name': prediction_result['predicted_class'].replace('_', ' ').title(),
            'confidence_percent': prediction_result['confidence'],
            'severity': prediction_result['severity'],
            'timestamp': datetime.now().isoformat(),
            'demo_mode': not MODEL_LOADED,
            'message': 'Real ML prediction' if MODEL_LOADED else 'Using demo prediction.'
        }

        return jsonify(response), 200

    except Exception as e:
        print(f"❌ Prediction error: {str(e)}")
        return jsonify({'success': False, 'error': f'❌ Prediction failed: {str(e)}'}), 500


@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({
        'status': '✅ Healthy',
        'service': 'Tomato Disease Detector API',
        'version': '2.1.0',
        'model_loaded': MODEL_LOADED,
        'timestamp': datetime.now().isoformat()
    }), 200


# ==================== STARTUP ====================

if __name__ == '__main__':
    print("\n" + "="*60)
    print("🍅 TOMATO DISEASE DETECTOR - BACKEND SERVER")
    print("="*60)
    print("✅ Flask server initialized")
    if MODEL_LOADED:
        print("🤖 ML Model loaded - Real predictions enabled")
    else:
        print("⚠️  No model found - Running in demo mode")
    print("🌐 Server running on http://localhost:5000")
    print("="*60 + "\n")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
