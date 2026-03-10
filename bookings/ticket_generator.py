import io
import qrcode
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from django.http import FileResponse


def generate_ticket(booking):

    buffer = io.BytesIO()

    p = canvas.Canvas(buffer, pagesize=letter)

    p.setFont("Helvetica-Bold", 20)
    p.drawString(200, 750, "Event Ticket")

    p.setFont("Helvetica", 12)

    p.drawString(100, 700, f"Booking ID: {booking.id}")
    p.drawString(100, 670, f"Event: {booking.event.title}")
    p.drawString(100, 640, f"Location: {booking.event.location}")
    p.drawString(100, 610, f"Date: {booking.event.date_time}")

    seats = ", ".join([seat.seat_number for seat in booking.seats.all()])
    p.drawString(100, 580, f"Seats: {seats}")

    # QR Code
    qr_data = f"Booking:{booking.id} Event:{booking.event.title} Seats:{seats}"

    qr = qrcode.make(qr_data)
    qr_path = "qr.png"
    qr.save(qr_path)

    p.drawImage(qr_path, 400, 550, width=120, height=120)

    p.save()

    buffer.seek(0)

    return buffer