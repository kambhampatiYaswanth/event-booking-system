from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from bookings.services import confirm_booking
from bookings.services import lock_seat
from rest_framework.generics import ListAPIView
from .models import Booking
from .serializers import BookingSerializer
from events.models import Seat
from django.http import FileResponse
from .ticket_generator import generate_ticket

class LockSeatView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):

        seat_id = request.data.get("seat_id")

        try:
            seat = lock_seat(request.user, seat_id)

            return Response({
                "message": "Seat locked",
                "seat_id": seat.id
            })

        except Exception as e:

            return Response({
                "error": str(e)
            }, status=400)
class ConfirmBookingView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        seat_ids = request.data.get("seat_ids")

        seats = Seat.objects.filter(id__in=seat_ids)

        if not seats.exists():
            return Response({"error": "No seats selected"}, status=400)

        event = seats.first().event

        booking = Booking.objects.create(
            user=request.user,
            event=event,
            status="CONFIRMED"
        )

        booking.seats.set(seats)

        for seat in seats:
            seat.is_booked = True
            seat.locked_by = None
            seat.save()

        return Response({
            "message": "Booking confirmed",
            "booking_id": booking.id
        })
class MyBookingsView(ListAPIView):
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user)

class DownloadTicketView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, booking_id):

        booking = Booking.objects.get(id=booking_id, user=request.user)

        pdf_buffer = generate_ticket(booking)

        return FileResponse(pdf_buffer, as_attachment=True, filename="ticket.pdf")