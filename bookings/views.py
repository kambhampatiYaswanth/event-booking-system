from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from bookings.services import confirm_booking
from bookings.services import lock_seat
from rest_framework.generics import ListAPIView
from .models import Booking
from .serializers import BookingSerializer


class LockSeatView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        seat_ids = request.data.get("seat_ids")

        if not seat_ids:
            return Response({"error": "seat_ids required"}, status=400)

        if len(seat_ids) > 6:
            return Response({"error": "Maximum 6 seats allowed"}, status=400)

        locked_seats = []

        for seat_id in seat_ids:
            seat = lock_seat(request.user, seat_id)
            locked_seats.append(seat.id)

        return Response({
            "message": "Seats locked",
            "seats": locked_seats
        })
class ConfirmBookingView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        seat_ids = request.data.get("seat_ids")

        seats = Seat.objects.filter(id__in=seat_ids)

        event = seats.first().event

        booking = Booking.objects.create(
            user=request.user,
            event=event,
            status="CONFIRMED"
        )

        booking.seats.set(seats)

        for seat in seats:
            seat.is_booked = True
            seat.is_locked = False
            seat.locked_by = None
            seat.save()

        return Response({
            "message": "Booking confirmed"
        })
class MyBookingsView(ListAPIView):
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user)
