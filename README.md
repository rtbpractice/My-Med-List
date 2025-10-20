# MyMedList v2 📱💊

A Progressive Web App (PWA) for scanning and managing prescription medications using OCR and barcode technology.

## 🚀 Features

- **📷 Camera Scanning** - Direct camera access for real-time prescription scanning
- **📁 File Upload** - Upload multiple prescription label photos
- **🔍 Smart OCR** - Advanced text recognition with error correction
- **📊 Barcode Scanning** - Extract medication info from prescription barcodes
- **💊 Medication Database** - Comprehensive drug information with API integration
- **📱 Mobile Optimized** - Touch-friendly interface for phones and tablets
- **🔄 Offline Support** - Works without internet connection
- **📋 Medication List** - Store and manage your medications
- **🖨️ Print/Share** - Generate medication lists for doctors

## 🎯 How It Works

1. **Scan or Upload** prescription label photos
2. **Smart Processing** extracts medication information
3. **Auto-fill Forms** with drug name, strength, directions, etc.
4. **Save to List** for easy management
5. **Print/Share** with healthcare providers

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **OCR**: Tesseract.js for text recognition
- **Barcode**: QuaggaJS for barcode scanning
- **APIs**: FDA NDC Directory, RxNorm
- **PWA**: Service Worker, Web App Manifest
- **Hosting**: Netlify (free)

## 📱 Installation

### For Users (Patients):
1. **Scan QR Code** with phone camera
2. **Tap notification** to open app
3. **Add to Home Screen** for native app experience

### For Developers:
```bash
# Clone repository
git clone https://github.com/yourusername/MyMedList.git

# Open in browser
open index.html

# Or serve locally
python -m http.server 8000
```

## 🌐 Live Demo

**App URL**: https://subtle-klepon-519f70.netlify.app

## 📋 Supported Medications

- **Finasteride** (Proscar/Propecia) - BPH and hair loss
- **Rosuvastatin** (Crestor) - Cholesterol management
- **Ondansetron** (Zofran) - Nausea prevention
- **And 80+ more** with API integration

## 🔧 Smart Features

- **OCR Error Correction** - Fixes common scanning mistakes
- **Drug Name Recognition** - Brand/generic name mapping
- **Medical Abbreviation Expansion** - QID → "4 times a day"
- **Days Supply Calculation** - Automatic duration calculation
- **Indication Auto-fill** - Drug purpose from database

## 📱 Mobile Features

- **Camera Access** - Direct phone camera integration
- **Touch Optimized** - Large buttons and touch-friendly interface
- **Responsive Design** - Works on all screen sizes
- **Offline Storage** - Data saved locally in browser

## 🏥 Healthcare Use

Perfect for:
- **Patients** - Manage personal medication lists
- **Healthcare Providers** - Quick prescription scanning
- **Pharmacies** - Verify medication information
- **Caregivers** - Track multiple medications

## 📄 License

This project is for educational and healthcare purposes. Not intended as medical advice.

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📞 Support

For questions or support, please open an issue on GitHub.

---

**⚠️ Disclaimer**: This app is a prototype for educational purposes. Always consult healthcare professionals for medical advice.
