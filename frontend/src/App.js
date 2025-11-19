import React, { useState, useRef, useEffect } from "react";
import { Camera, Upload, AlertCircle, LogOut, User, Lock, Mail, Leaf, Sun, Shield, Zap, Activity, TrendingUp, CheckCircle, Eye, EyeOff } from "lucide-react";

const API_URL = "https://tomato-ai.onrender.com/api";

const translations = {
  en: {
    title: "🍅 Tomato Disease Detector",
    subtitle: "AI-Powered Plant Health Monitor",
    login: "Login",
    register: "Register",
    email: "Email",
    password: "Password",
    confirmPassword: "Re-enter Password",
    name: "Full Name",
    loginBtn: "Sign In",
    registerBtn: "Sign Up",
    logout: "Logout",
    welcome: "Welcome",
    uploadImage: "Upload Image",
    startCamera: "Start Camera",
    capture: "Capture Photo",
    predict: "Analyze Disease",
    analyzing: "Analyzing Plant...",
    confidence: "Confidence",
    severity: "Severity",
    treatment: "Treatment & Solutions",
    error: "Error",
    uploadFirst: "Please upload or capture an image first!",
    alreadyAccount: "Already have an account?",
    noAccount: "Don't have an account?",
    clickHere: "Click here",
    detectionResults: "Detection Results",
    recommendations: "Treatment Recommendations",
    forgotPassword: "Forgot Password?",
    resetPassword: "Reset Password",
    sendResetLink: "Send Reset Link",
    backToLogin: "Back to Login",
    resetEmailSent: "Password reset link sent to your email!",
    passwordMismatch: "Passwords do not match!",
    passwordTooShort: "Password must be at least 6 characters!"
  },
  hi: {
    title: "🍅 टमाटर रोग पहचानकर्ता",
    subtitle: "एआई-संचालित पौधा स्वास्थ्य मॉनिटर",
    login: "लॉगिन",
    register: "रजिस्टर",
    email: "ईमेल",
    password: "पासवर्ड",
    confirmPassword: "पासवर्ड फिर से दर्ज करें",
    name: "पूरा नाम",
    loginBtn: "साइन इन करें",
    registerBtn: "साइन अप करें",
    logout: "लॉगआउट",
    welcome: "स्वागत है",
    uploadImage: "फोटो अपलोड करें",
    startCamera: "कैमरा शुरू करें",
    capture: "फोटो लें",
    predict: "रोग का विश्लेषण करें",
    analyzing: "पौधे का विश्लेषण...",
    confidence: "विश्वास स्तर",
    severity: "गंभीरता",
    treatment: "उपचार और समाधान",
    error: "त्रुटि",
    uploadFirst: "कृपया पहले एक फोटो अपलोड या कैप्चर करें!",
    alreadyAccount: "पहले से खाता है?",
    noAccount: "खाता नहीं है?",
    clickHere: "यहां क्लिक करें",
    detectionResults: "पहचान परिणाम",
    recommendations: "उपचार सिफारिशें",
    forgotPassword: "पासवर्ड भूल गए?",
    resetPassword: "पासवर्ड रीसेट करें",
    sendResetLink: "रीसेट लिंक भेजें",
    backToLogin: "लॉगिन पर वापस जाएं",
    resetEmailSent: "आपके ईमेल पर पासवर्ड रीसेट लिंक भेज दिया गया है!",
    passwordMismatch: "पासवर्ड मेल नहीं खाते!",
    passwordTooShort: "पासवर्ड कम से कम 6 अक्षर का होना चाहिए!"
  },
  kn: {
    title: "🍅 ಟೊಮ್ಯಾಟೊ ರೋಗ ಪತ್ತೆಕಾರ",
    subtitle: "AI-ಚಾಲಿತ ಸಸ್ಯ ಆರೋಗ್ಯ ಮಾನಿಟರ್",
    login: "ಲಾಗಿನ್",
    register: "ನೋಂದಣಿ",
    email: "ಇಮೇಲ್",
    password: "ಪಾಸ್‌ವರ್ಡ್",
    confirmPassword: "ಪಾಸ್‌ವರ್ಡ್ ಮರು ನಮೂದಿಸಿ",
    name: "ಪೂರ್ಣ ಹೆಸರು",
    loginBtn: "ಸೈನ್ ಇನ್",
    registerBtn: "ಸೈನ್ ಅಪ್",
    logout: "ಲಾಗ್ಔಟ್",
    welcome: "ಸುಸ್ವಾಗತ",
    uploadImage: "ಫೋಟೋ ಅಪ್‌ಲೋಡ್",
    startCamera: "ಕ್ಯಾಮೆರಾ ಪ್ರಾರಂಭಿಸಿ",
    capture: "ಫೋಟೋ ತೆಗೆಯಿರಿ",
    predict: "ರೋಗ ವಿಶ್ಲೇಷಣೆ",
    analyzing: "ಸಸ್ಯ ವಿಶ್ಲೇಷಣೆ...",
    confidence: "ವಿಶ್ವಾಸ",
    severity: "ತೀವ್ರತೆ",
    treatment: "ಚಿಕಿತ್ಸೆ ಮತ್ತು ಪರಿಹಾರಗಳು",
    error: "ದೋಷ",
    uploadFirst: "ದಯವಿಟ್ಟು ಮೊದಲು ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ!",
    alreadyAccount: "ಈಗಾಗಲೇ ಖಾತೆ ಇದೆಯೇ?",
    noAccount: "ಖಾತೆ ಇಲ್ಲವೇ?",
    clickHere: "ಇಲ್ಲಿ ಕ್ಲಿಕ್ ಮಾಡಿ",
    detectionResults: "ಪತ್ತೆ ಫಲಿತಾಂಶಗಳು",
    recommendations: "ಚಿಕಿತ್ಸೆ ಶಿಫಾರಸುಗಳು",
    forgotPassword: "ಪಾಸ್‌ವರ್ಡ್ ಮರೆತಿರುವಿರಾ?",
    resetPassword: "ಪಾಸ್‌ವರ್ಡ್ ಮರುಹೊಂದಿಸಿ",
    sendResetLink: "ರೀಸೆಟ್ ಲಿಂಕ್ ಕಳುಹಿಸಿ",
    backToLogin: "ಲಾಗಿನ್‌ಗೆ ಹಿಂತಿರುಗಿ",
    resetEmailSent: "ನಿಮ್ಮ ಇಮೇಲ್‌ಗೆ ಪಾಸ್‌ವರ್ಡ್ ರೀಸೆಟ್ ಲಿಂಕ್ ಕಳುಹಿಸಲಾಗಿದೆ!",
    passwordMismatch: "ಪಾಸ್‌ವರ್ಡ್‌ಗಳು ಹೊಂದಿಕೆಯಾಗುತ್ತಿಲ್ಲ!",
    passwordTooShort: "ಪಾಸ್‌ವರ್ಡ್ ಕನಿಷ್ಠ 6 ಅಕ್ಷರಗಳಾಗಿರಬೇಕು!"
  },
  te: {
    title: "🍅 టమోటా వ్యాధి డిటెక్టర్",
    subtitle: "AI-ఆధారిత మొక్క ఆరోగ్య మానిటర్",
    login: "లాగిన్",
    register: "రిజిస్టర్",
    email: "ఇమెయిల్",
    password: "పాస్‌వర్డ్",
    confirmPassword: "పాస్‌వర్డ్ మళ్లీ నమోదు చేయండి",
    name: "పూర్తి పేరు",
    loginBtn: "సైన్ ఇన్",
    registerBtn: "సైన్ అప్",
    logout: "లాగౌట్",
    welcome: "స్వాగతం",
    uploadImage: "ఫోటో అప్‌లోడ్",
    startCamera: "కెమెరా ప్రారంభించు",
    capture: "ఫోటో తీయండి",
    predict: "వ్యాధి విశ్లేషణ",
    analyzing: "మొక్క విశ్లేషణ...",
    confidence: "విశ్వాసం",
    severity: "తీవ్రత",
    treatment: "చికిత్స మరియు పరిష్కారాలు",
    error: "లోపం",
    uploadFirst: "దయచేసి మొదట ఫోటో అప్‌లోడ్ చేయండి!",
    alreadyAccount: "ఇప్పటికే ఖాతా ఉందా?",
    noAccount: "ఖాతా లేదా?",
    clickHere: "ఇక్కడ క్లిక్ చేయండి",
    detectionResults: "గుర్తింపు ఫలితాలు",
    recommendations: "చికిత్స సిఫార్సులు",
    forgotPassword: "పాస్‌వర్డ్ మర్చిపోయారా?",
    resetPassword: "పాస్‌వర్డ్ రీసెట్ చేయండి",
    sendResetLink: "రీసెట్ లింక్ పంపండి",
    backToLogin: "లాగిన్‌కు తిరిగి వెళ్ళండి",
    resetEmailSent: "మీ ఇమెయిల్‌కు పాస్‌వర్డ్ రీసెట్ లింక్ పంపబడింది!",
    passwordMismatch: "పాస్‌వర్డ్‌లు సరిపోలడం లేదు!",
    passwordTooShort: "పాస్‌వర్డ్ కనీసం 6 అక్షరాలు ఉండాలి!"
  }
};

const diseaseSolutions = {
  Tomato_Target_Spot: [
    "Apply fungicides containing chlorothalonil or mancozeb at 7-14 day intervals.",
    "Stake and prune plants for better airflow. Remove plant debris and practice crop rotation."
  ],
  Tomato_mosaic_virus: [
    "Remove infected plants immediately. Disinfect tools with 10% bleach solution.",
    "Control aphid populations. Plant resistant varieties and avoid tobacco use near plants."
  ],
  Tomato_Yellow_Leaf_Curl_Virus: [
    "Remove and destroy infected plants immediately to prevent spread.",
    "Control whitefly populations with insecticides or yellow sticky traps. Use virus-resistant varieties."
  ],
  Tomato_Bacterial_spot: [
    "Apply copper-based bactericides at the first sign of disease. Repeat every 7-10 days.",
    "Remove and destroy infected plant parts immediately. Practice crop rotation for at least 2 years."
  ],
  Tomato_Early_blight: [
    "Use fungicides containing chlorothalonil or mancozeb. Apply weekly during humid weather.",
    "Mulch around plants to prevent soil splash. Remove lower leaves to improve air circulation."
  ],
  Tomato_healthy: [
    "Continue regular watering (1-2 inches per week). Maintain consistent moisture levels.",
    "Apply balanced fertilizer monthly. Monitor regularly for early signs of pests or diseases."
  ],
  Tomato_Late_blight: [
    "Apply fungicides with copper or mancozeb before symptoms appear during wet weather.",
    "Space plants properly for good air flow. Water at base of plants, not overhead."
  ],
  Tomato_Leaf_Mold: [
    "Improve greenhouse ventilation to reduce humidity below 85%.",
    "Apply fungicides containing chlorothalonil. Remove affected leaves promptly."
  ],
  Tomato_Septoria_leaf_spot: [
    "Apply fungicides with chlorothalonil or copper. Begin at first sign of symptoms.",
    "Remove infected leaves from bottom up. Avoid overhead watering and mulch soil."
  ],
  Tomato_Spider_mites_Two_spotted_spider_mite: [
    "Spray plants with strong water jet to dislodge mites. Apply insecticidal soap or neem oil.",
    "Introduce predatory mites. Keep plants well-watered as stressed plants are more susceptible."
  ]
};

export default function App() {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [language, setLanguage] = useState("en");
  const [formData, setFormData] = useState({ email: "", password: "", confirmPassword: "", name: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef();

  const t = translations[language];

  useEffect(() => {
    const savedUser = sessionStorage.getItem("tomatoAppUser");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleAuth = async () => {
    if (showLogin) {
      if (formData.email && formData.password) {
        try {
          const res = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: formData.email, password: formData.password })
          });
          const data = await res.json();
          
          if (data.success) {
            const userData = { email: formData.email, name: data.name || formData.email.split("@")[0] };
            setUser(userData);
            sessionStorage.setItem("tomatoAppUser", JSON.stringify(userData));
          } else {
            alert(data.message || "Login failed. Please check your credentials.");
          }
        } catch (error) {
          alert("Login error. Please try again.");
        }
      }
    } else {
      // Registration validation
      if (!formData.email || !formData.password || !formData.confirmPassword || !formData.name) {
        alert("Please fill in all fields.");
        return;
      }

      if (formData.password.length < 6) {
        alert(t.passwordTooShort);
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        alert(t.passwordMismatch);
        return;
      }

      try {
        const res = await fetch(`${API_URL}/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            name: formData.name
          })
        });
        const data = await res.json();
        
        if (data.success) {
          alert(`✅ Registration successful! Welcome email sent to ${formData.email}`);
          const userData = { email: formData.email, name: formData.name };
          setUser(userData);
          sessionStorage.setItem("tomatoAppUser", JSON.stringify(userData));
        } else {
          alert(data.message || "Registration failed. Please try again.");
        }
      } catch (error) {
        alert("Registration error. Please try again.");
      }
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      alert("Please enter your email address.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email })
      });
      const data = await res.json();
      
      if (data.success) {
        alert(t.resetEmailSent);
        setShowForgotPassword(false);
        setShowLogin(true);
      } else {
        alert(data.message || "Failed to send reset link.");
      }
    } catch (error) {
      alert("Error sending reset link. Please try again.");
    }
  };

  const handleLogout = () => {
    setUser(null);
    sessionStorage.removeItem("tomatoAppUser");
    setImage(null);
    setResult(null);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      videoRef.current.srcObject = stream;
      setCameraActive(true);
    } catch (err) {
      alert("Camera access denied or not available");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      setCameraActive(false);
    }
  };

  const captureImage = () => {
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      setImage(new File([blob], "captured.jpg", { type: "image/jpeg" }));
      stopCamera();
    });
  };

  const handlePredict = async () => {
    if (!image) return alert(t.uploadFirst);
    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("image", image);

      const res = await fetch(`${API_URL}/predict`, { method: "POST", body: formData });
      const data = await res.json();
      
      if (data.success && data.predicted_class) {
        data.solutions = diseaseSolutions[data.predicted_class] || diseaseSolutions.Tomato_healthy;
      }
      
      setResult(data);
    } catch (error) {
      setResult({ success: false, error: "Connection error. Please check if backend is running." });
    }
    setLoading(false);
  };

  const styles = `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
      background: #000;
      color: #fff;
    }
    
    .app-container {
      min-height: 100vh;
      background: #000;
      position: relative;
      overflow-x: hidden;
    }
    
    .bg-orbs {
      position: absolute;
      inset: 0;
      overflow: hidden;
      pointer-events: none;
    }
    
    .orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      animation: pulse 4s ease-in-out infinite;
      mix-blend-mode: screen;
    }
    
    .orb-1 {
      top: 10%;
      left: 20%;
      width: 400px;
      height: 400px;
      background: #ff6600;
      opacity: 0.2;
    }
    
    .orb-2 {
      top: 33%;
      right: 10%;
      width: 350px;
      height: 350px;
      background: #ff7700;
      opacity: 0.15;
      animation-delay: 2s;
    }
    
    .orb-3 {
      bottom: 20%;
      left: 33%;
      width: 300px;
      height: 300px;
      background: #ff8800;
      opacity: 0.25;
      animation-delay: 4s;
    }
    
    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 0.2; }
      50% { transform: scale(1.1); opacity: 0.3; }
    }
    
    .content-wrapper {
      position: relative;
      z-index: 10;
      max-width: 1400px;
      margin: 0 auto;
      padding: 24px;
    }
    
    .card {
      background: linear-gradient(135deg, #1a1a1a 0%, #000 100%);
      border-radius: 24px;
      padding: 32px;
      border: 2px solid rgba(255, 102, 0, 0.3);
      box-shadow: 0 20px 60px rgba(255, 102, 0, 0.2);
      margin-bottom: 24px;
    }
    
    .header-flex {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
    }
    
    .header-left {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    
    .icon-box {
      padding: 16px;
      background: linear-gradient(135deg, #ff6600 0%, #ff5500 100%);
      border-radius: 16px;
      box-shadow: 0 10px 30px rgba(255, 102, 0, 0.5);
    }
    
    .title {
      font-size: 32px;
      font-weight: 900;
      color: #fff;
      margin: 0;
    }
    
    .subtitle {
      font-size: 14px;
      color: #ff8800;
      font-weight: 700;
      margin-top: 4px;
    }
    
    .lang-buttons {
      display: flex;
      gap: 8px;
    }
    
    .lang-btn {
      padding: 10px 16px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s;
      border: none;
    }
    
    .lang-btn-active {
      background: #ff6600;
      color: #fff;
      box-shadow: 0 4px 12px rgba(255, 102, 0, 0.5);
    }
    
    .lang-btn-inactive {
      background: #2a2a2a;
      color: #ff8800;
      border: 1px solid rgba(255, 102, 0, 0.3);
    }
    
    .lang-btn:hover {
      transform: scale(1.1);
    }
    
    .logout-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
      color: #fff;
      padding: 10px 24px;
      border-radius: 8px;
      font-weight: 700;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.3s;
      border: none;
      box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
    }
    
    .logout-btn:hover {
      transform: scale(1.05);
    }
    
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
    }
    
    .login-card {
      background: linear-gradient(135deg, #1a1a1a 0%, #000 100%);
      border-radius: 24px;
      padding: 40px;
      max-width: 480px;
      width: 100%;
      border: 2px solid rgba(255, 102, 0, 0.3);
      box-shadow: 0 20px 60px rgba(255, 102, 0, 0.2);
      position: relative;
    }
    
    .login-header {
      text-align: center;
      margin-bottom: 32px;
    }
    
    .input-group {
      position: relative;
      margin-bottom: 20px;
    }
    
    .input-icon {
      position: absolute;
      left: 16px;
      top: 16px;
      color: #ff6600;
    }
    
    .input-field {
      width: 100%;
      padding: 16px 16px 16px 56px;
      border: 2px solid rgba(255, 102, 0, 0.3);
      border-radius: 12px;
      background: rgba(42, 42, 42, 0.5);
      color: #fff;
      font-size: 16px;
      font-weight: 500;
      transition: all 0.3s;
    }
    
    .input-field:focus {
      outline: none;
      border-color: #ff6600;
      box-shadow: 0 0 0 3px rgba(255, 102, 0, 0.1);
    }
    
    .input-field::placeholder {
      color: #666;
    }

    .password-toggle {
      position: absolute;
      right: 16px;
      top: 16px;
      cursor: pointer;
      color: #ff6600;
      transition: all 0.3s;
    }

    .password-toggle:hover {
      color: #ff8800;
    }

    .forgot-password-link {
      text-align: right;
      margin-top: -10px;
      margin-bottom: 20px;
    }

    .forgot-link {
      color: #ff6600;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      text-decoration: none;
    }

    .forgot-link:hover {
      text-decoration: underline;
    }
    
    .primary-btn {
      width: 100%;
      background: linear-gradient(135deg, #ff6600 0%, #ff5500 100%);
      color: #fff;
      padding: 16px;
      border-radius: 12px;
      font-weight: 900;
      font-size: 18px;
      cursor: pointer;
      transition: all 0.3s;
      border: none;
      box-shadow: 0 10px 30px rgba(255, 102, 0, 0.5);
    }
    
    .primary-btn:hover {
      transform: scale(1.05);
    }
    
    .primary-btn:active {
      transform: scale(0.95);
    }
    
    .toggle-text {
      text-align: center;
      margin-top: 24px;
      color: #999;
      font-size: 14px;
    }
    
    .toggle-link {
      color: #ff6600;
      font-weight: 700;
      cursor: pointer;
      text-decoration: none;
    }
    
    .toggle-link:hover {
      text-decoration: underline;
    }
    
    .action-buttons {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      justify-content: center;
      margin-bottom: 32px;
    }
    
    .action-btn {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 32px;
      border-radius: 12px;
      font-weight: 700;
      font-size: 16px;
      cursor: pointer;
      transition: all 0.3s;
      border: none;
    }
    
    .btn-primary {
      background: linear-gradient(135deg, #ff6600 0%, #ff5500 100%);
      color: #fff;
      box-shadow: 0 10px 30px rgba(255, 102, 0, 0.5);
    }
    
    .btn-secondary {
      background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
      color: #ff8800;
      border: 2px solid rgba(255, 102, 0, 0.3);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }
    
    .action-btn:hover {
      transform: scale(1.05);
    }
    
    .action-btn:active {
      transform: scale(0.95);
    }
    
    .preview-container {
      display: flex;
      justify-content: center;
      margin-bottom: 32px;
    }
    
    .preview-media {
      border-radius: 16px;
      max-width: 800px;
      width: 100%;
      border: 4px solid rgba(255, 102, 0, 0.5);
      box-shadow: 0 10px 40px rgba(255, 102, 0, 0.3);
    }
    
    .predict-container {
      text-align: center;
      margin-bottom: 32px;
    }
    
    .predict-btn {
      display: inline-flex;
      align-items: center;
      gap: 16px;
      background: linear-gradient(135deg, #ff6600 0%, #ff5500 100%);
      color: #fff;
      padding: 24px 48px;
      border-radius: 16px;
      font-size: 20px;
      font-weight: 900;
      cursor: pointer;
      transition: all 0.3s;
      border: none;
      box-shadow: 0 20px 60px rgba(255, 102, 0, 0.5);
    }
    
    .predict-btn:hover {
      transform: scale(1.1);
    }
    
    .predict-btn:active {
      transform: scale(0.95);
    }
    
    .predict-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
    }
    
    .results-card {
      background: linear-gradient(135deg, #1a1a1a 0%, #000 100%);
      padding: 40px;
      border-radius: 24px;
      border: 4px solid rgba(255, 102, 0, 0.5);
      box-shadow: 0 20px 60px rgba(255, 102, 0, 0.2);
    }
    
    .results-header {
      text-align: center;
      margin-bottom: 40px;
    }
    
    .results-title {
      font-size: 48px;
      font-weight: 900;
      color: #fff;
      margin: 16px 0;
    }
    
    .results-badge {
      display: inline-block;
      background: rgba(255, 102, 0, 0.2);
      padding: 12px 24px;
      border-radius: 999px;
      border: 2px solid rgba(255, 102, 0, 0.5);
      color: #ff8800;
      font-weight: 700;
    }
    
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 24px;
      margin-bottom: 40px;
    }
    
    .metric-card {
      background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
      padding: 32px;
      border-radius: 16px;
      border: 2px solid rgba(255, 102, 0, 0.3);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }
    
    .metric-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 16px;
    }
    
    .metric-icon {
      padding: 12px;
      background: #ff6600;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(255, 102, 0, 0.4);
    }
    
    .metric-label {
      color: #ff8800;
      font-weight: 700;
      font-size: 20px;
    }
    
    .metric-value {
      font-size: 56px;
      font-weight: 900;
      color: #fff;
      margin-bottom: 16px;
    }
    
    .progress-bar {
      background: #333;
      border-radius: 999px;
      height: 16px;
      overflow: hidden;
      box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
    }
    
    .progress-fill {
      background: linear-gradient(90deg, #ff6600 0%, #ff8800 100%);
      height: 100%;
      transition: width 1s ease;
      box-shadow: 0 0 10px rgba(255, 102, 0, 0.5);
    }
    
    .severity-badge {
      display: inline-block;
      padding: 12px 24px;
      border-radius: 999px;
      font-size: 16px;
      font-weight: 700;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }
    
    .severity-high {
      background: #dc2626;
      color: #fff;
    }
    
    .severity-moderate {
      background: #ff6600;
      color: #fff;
    }
    
    .severity-low {
      background: #fbbf24;
      color: #fff;
    }
    
    .severity-none {
      background: #10b981;
      color: #fff;
    }
    
    .treatment-section {
      background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
      padding: 40px;
      border-radius: 24px;
      border: 2px solid rgba(255, 102, 0, 0.3);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }
    
    .treatment-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 32px;
    }
    
    .treatment-title {
      font-size: 32px;
      font-weight: 900;
      color: #fff;
    }
    
    .solutions-list {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    
    .solution-item {
      display: flex;
      align-items: flex-start;
      gap: 20px;
      padding: 24px;
      background: rgba(0, 0, 0, 0.5);
      border-radius: 12px;
      border: 2px solid rgba(255, 102, 0, 0.2);
      transition: all 0.3s;
    }
    
    .solution-item:hover {
      border-color: rgba(255, 102, 0, 0.5);
      box-shadow: 0 4px 12px rgba(255, 102, 0, 0.2);
    }
    
    .solution-number {
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 48px;
      height: 48px;
      background: #ff6600;
      color: #fff;
      border-radius: 12px;
      font-size: 20px;
      font-weight: 900;
      box-shadow: 0 4px 12px rgba(255, 102, 0, 0.4);
    }
    
    .solution-text {
      flex: 1;
      color: #ccc;
      line-height: 1.6;
      font-size: 16px;
      font-weight: 500;
    }
    
    .error-container {
      text-align: center;
      padding: 64px 0;
    }
    
    .error-icon {
      display: inline-block;
      padding: 24px;
      background: rgba(220, 38, 38, 0.2);
      border-radius: 999px;
      border: 4px solid rgba(220, 38, 38, 0.5);
      margin-bottom: 24px;
    }
    
    .error-title {
      font-size: 32px;
      font-weight: 900;
      color: #dc2626;
      margin-bottom: 16px;
    }
    
    .error-message {
      color: #ef4444;
      font-weight: 700;
      font-size: 18px;
    }
    
    .footer {
      text-align: center;
      margin-top: 24px;
    }
    
    .footer-card {
      background: linear-gradient(135deg, #1a1a1a 0%, #000 100%);
      border-radius: 16px;
      padding: 20px;
      border: 2px solid rgba(255, 102, 0, 0.3);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }
    
    .footer-text {
      color: #ff8800;
      font-size: 14px;
      font-weight: 700;
    }
    
    @media (max-width: 768px) {
      .header-flex {
        flex-direction: column;
      }
      
      .title {
        font-size: 24px;
      }
      
      .action-buttons {
        flex-direction: column;
        width: 100%;
      }
      
      .action-btn {
        width: 100%;
        justify-content: center;
      }
      
      .results-title {
        font-size: 32px;
      }
      
      .metric-value {
        font-size: 40px;
      }
    }
  `;

  if (!user) {
    return (
      <div className="app-container">
        <style>{styles}</style>
        <div className="bg-orbs">
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
          <div className="orb orb-3"></div>
        </div>
        
        <div style={{ position: 'absolute', top: '24px', right: '24px', zIndex: 20 }}>
          <div className="lang-buttons">
            {["en", "hi", "kn", "te"].map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`lang-btn ${language === lang ? 'lang-btn-active' : 'lang-btn-inactive'}`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="login-container">
          <div className="login-card">
            <div className="login-header">
              <div className="icon-box" style={{ display: 'inline-block', marginBottom: '16px' }}>
                <Leaf size={56} color="#fff" />
              </div>
              <h1 className="title" style={{ fontSize: '36px', marginBottom: '12px' }}>{t.title}</h1>
              <p className="subtitle">{t.subtitle}</p>
              <div style={{ marginTop: '20px' }}>
                <div className="results-badge">
                  {showForgotPassword ? t.resetPassword : (showLogin ? t.login : t.register)}
                </div>
              </div>
            </div>

            {showForgotPassword ? (
              <div>
                <div className="input-group">
                  <Mail className="input-icon" size={22} />
                  <input
                    type="email"
                    placeholder={t.email}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input-field"
                  />
                </div>

                <button onClick={handleForgotPassword} className="primary-btn">
                  {t.sendResetLink}
                </button>

                <div className="toggle-text">
                  <span 
                    className="toggle-link" 
                    onClick={() => {
                      setShowForgotPassword(false);
                      setShowLogin(true);
                    }}
                  >
                    ← {t.backToLogin}
                  </span>
                </div>
              </div>
            ) : (
              <div>
                {!showLogin && (
                  <div className="input-group">
                    <User className="input-icon" size={22} />
                    <input
                      type="text"
                      placeholder={t.name}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="input-field"
                    />
                  </div>
                )}

                <div className="input-group">
                  <Mail className="input-icon" size={22} />
                  <input
                    type="email"
                    placeholder={t.email}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div className="input-group">
                  <Lock className="input-icon" size={22} />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder={t.password}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="input-field"
                  />
                  <div 
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </div>
                </div>

                {!showLogin && (
                  <div className="input-group">
                    <Lock className="input-icon" size={22} />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder={t.confirmPassword}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="input-field"
                    />
                    <div 
                      className="password-toggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </div>
                  </div>
                )}

                {showLogin && (
                  <div className="forgot-password-link">
                    <span 
                      className="forgot-link"
                      onClick={() => setShowForgotPassword(true)}
                    >
                      {t.forgotPassword}
                    </span>
                  </div>
                )}

                <button onClick={handleAuth} className="primary-btn">
                  {showLogin ? t.loginBtn : t.registerBtn}
                </button>
              </div>
            )}

            {!showForgotPassword && (
              <div className="toggle-text">
                {showLogin ? t.noAccount : t.alreadyAccount}{" "}
                <span className="toggle-link" onClick={() => setShowLogin(!showLogin)}>
                  {t.clickHere}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <style>{styles}</style>
      <div className="bg-orbs">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      <div className="content-wrapper">
        <div className="card">
          <div className="header-flex">
            <div className="header-left">
              <div className="icon-box">
                <Leaf size={48} color="#fff" />
              </div>
              <div>
                <h1 className="title">{t.title}</h1>
                <p className="subtitle">
                  {t.welcome}, <strong>{user.name}</strong> 🌱
                </p>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div className="lang-buttons">
                {["en", "hi", "kn", "te"].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`lang-btn ${language === lang ? 'lang-btn-active' : 'lang-btn-inactive'}`}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>
              <button onClick={handleLogout} className="logout-btn">
                <LogOut size={18} /> {t.logout}
              </button>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="action-buttons">
            <label style={{ cursor: 'pointer' }}>
              <div className="action-btn btn-primary">
                <Upload size={24} /> {t.uploadImage}
              </div>
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  setImage(e.target.files[0]);
                  stopCamera();
                }}
              />
            </label>

            <button
              onClick={cameraActive ? stopCamera : startCamera}
              className="action-btn btn-secondary"
            >
              <Camera size={24} /> {cameraActive ? "Stop Camera" : t.startCamera}
            </button>

            {cameraActive && (
              <button onClick={captureImage} className="action-btn btn-primary">
                <Zap size={24} /> {t.capture}
              </button>
            )}
          </div>

          <div className="preview-container">
            {cameraActive && (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="preview-media"
              />
            )}
            {image && !cameraActive && (
              <img
                src={URL.createObjectURL(image)}
                alt="Preview"
                className="preview-media"
              />
            )}
          </div>

          {image && !cameraActive && (
            <div className="predict-container">
              <button
                onClick={handlePredict}
                disabled={loading}
                className="predict-btn"
              >
                <Shield size={32} />
                {loading ? (
                  <>
                    <Activity className="animate-spin" size={28} />
                    {t.analyzing}
                  </>
                ) : (
                  t.predict
                )}
              </button>
            </div>
          )}

          {result && (
            <div className="results-card">
              {result.success ? (
                <div>
                  <div className="results-header">
                    <div className="icon-box" style={{ display: 'inline-block', marginBottom: '20px' }}>
                      <Leaf size={64} color="#fff" />
                    </div>
                    <h2 className="results-title">
                      {result.predicted_name?.replace(/_/g, " ") || "Unknown"}
                    </h2>
                    <div className="results-badge">{t.detectionResults}</div>
                  </div>
                  
                  <div className="metrics-grid">
                    <div className="metric-card">
                      <div className="metric-header">
                        <div className="metric-icon">
                          <TrendingUp size={32} color="#fff" />
                        </div>
                        <p className="metric-label">{t.confidence}</p>
                      </div>
                      <p className="metric-value">{result.confidence_percent}%</p>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{width: `${result.confidence_percent}%`}}
                        ></div>
                      </div>
                    </div>

                    <div className="metric-card">
                      <div className="metric-header">
                        <div className="metric-icon">
                          <Sun size={32} color="#fff" />
                        </div>
                        <p className="metric-label">{t.severity}</p>
                      </div>
                      <p className="metric-value" style={{ fontSize: '40px' }}>{result.severity || "N/A"}</p>
                      <div>
                        <span className={`severity-badge ${
                          result.severity === "High" ? 'severity-high' :
                          result.severity === "Moderate" ? 'severity-moderate' :
                          result.severity === "Low" ? 'severity-low' :
                          'severity-none'
                        }`}>
                          {result.severity === "None" ? "✓ Healthy Plant" : `⚠ ${result.severity} Risk`}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="treatment-section">
                    <div className="treatment-header">
                      <div className="metric-icon">
                        <Shield size={40} color="#fff" />
                      </div>
                      <h3 className="treatment-title">{t.recommendations}</h3>
                    </div>
                    {result.solutions ? (
                      <div className="solutions-list">
                        {result.solutions.map((solution, idx) => (
                          <div key={idx} className="solution-item">
                            <div className="solution-number">{idx + 1}</div>
                            <div className="solution-text">{solution}</div>
                            <CheckCircle size={24} color="#ff6600" style={{ flexShrink: 0, marginTop: '4px' }} />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="solution-text" style={{ textAlign: 'center', padding: '24px' }}>
                        {result.treatment || "No treatment information available."}
                      </p>
                    )}
                  </div>

                  {result.demo_mode && (
                    <div style={{ marginTop: '32px', textAlign: 'center' }}>
                      <div className="results-badge">
                        🔬 Demo Mode: {result.message}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="error-container">
                  <div className="error-icon">
                    <AlertCircle size={64} color="#dc2626" />
                  </div>
                  <h3 className="error-title">{t.error}</h3>
                  <p className="error-message">{result.error || "Unknown error occurred"}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="footer">
        <div className="footer-card">
          <p className="footer-text">
            🌱 Powered by AI • Protecting Your Tomato Crops • 2025
          </p>
        </div>
      </div>
    </div>
  );
}