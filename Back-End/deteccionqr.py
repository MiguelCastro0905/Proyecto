import cv2
import requests
import time

# Instancia del detector QR
qrCode = cv2.QRCodeDetector()
cap = cv2.VideoCapture(0)

# URL base de tu API
BASE_URL = "http://localhost:8000"  # cámbiala si es necesario
ID_SEDE = 1  # Asigna la sede correspondiente

if not cap.isOpened():
    print("No se puede abrir la cámara")
    exit()

ultimo_qr_leido = None
tiempo_ultimo_escaneo = 0

while True:
    ret, frame = cap.read()

    if ret:
        ret_qr, decoded_info, points, _ = qrCode.detectAndDecodeMulti(frame)

        if ret_qr and points is not None:
            for info, point in zip(decoded_info, points):
                if info:
                    color = (0, 255, 0)
                    frame = cv2.polylines(frame, [point.astype(int)], True, color, 4)

                    # Solo proceder si han pasado al menos 3 segundos desde el último escaneo
                    if info != ultimo_qr_leido or time.time() - tiempo_ultimo_escaneo > 3:
                        print(f"QR Detectado: {info}")
                        ultimo_qr_leido = info
                        tiempo_ultimo_escaneo = time.time()

                        if info.startswith("CARNET-"):
                            try:
                                id_carnet = int(info.replace("CARNET-", ""))

                                # 1. Intentar registrar salida
                                response = requests.patch(f"{BASE_URL}/salida-sede/{id_carnet}")

                                if response.status_code == 200:
                                    print("✅ Salida registrada:", response.json())
                                elif response.status_code == 404:
                                    # 2. Si no hay ingreso activo, registrar entrada
                                    payload = {
                                        "Fk_Id_Carnet": id_carnet,
                                        "Fk_Id_Sede": ID_SEDE
                                    }
                                    ingreso_response = requests.post(f"{BASE_URL}/ingreso-sede", json=payload)
                                    if ingreso_response.status_code == 201:
                                        print("✅ Ingreso registrado:", ingreso_response.json())
                                    else:
                                        print("❌ Error al registrar ingreso:", ingreso_response.text)
                                else:
                                    print("❌ Error al registrar salida:", response.text)
                            except Exception as e:
                                print("❌ Error procesando el QR:", e)
                        else:
                            print("⚠️ QR no válido")
                else:
                    color = (0, 0, 255)
                    frame = cv2.polylines(frame, [point.astype(int)], True, color, 4)

    else:
        print("No se puede recibir el fotograma. Saliendo...")
        break

    cv2.imshow('Detector de códigos QR - CardiAS', frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
