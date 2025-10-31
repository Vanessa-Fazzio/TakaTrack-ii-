#!/usr/bin/env python3
import qrcode

# Your local IP and frontend port
ip = "172.30.37.144"
url = f"http://{ip}:3000"

# Generate QR code
qr = qrcode.QRCode(version=1, box_size=10, border=5)
qr.add_data(url)
qr.make(fit=True)

print(f"\n📱 TakaTrack Mobile Access")
print(f"🌐 URL: {url}")
print(f"\n📋 QR Code (scan with phone):")
qr.print_ascii()
print(f"\n✅ Steps:")
print(f"1. Run: ./start-app.sh")
print(f"2. Scan QR code with phone camera")
print(f"3. Login: demo@takatrack.com / demo123")
print(f"\n⚠️  Phone must be on same WiFi network!")