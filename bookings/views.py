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
        seat_id = request.data.get("seat_id")

        if not seat_id:
            return Response(
                {"error": "seat_id is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            seat = lock_seat(request.user, seat_id)

            return Response(
                {"message": "Seat locked successfully", "seat_id": seat.id},
                status=status.HTTP_200_OK
            )

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
class ConfirmBookingView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):

        seat_id = request.data.get("seat_id")

        if not seat_id:
            return Response(
                {"error": "seat_id is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            booking = confirm_booking(request.user, seat_id)

            return Response(
                {
                    "message": "Booking confirmed successfully",
                    "booking_id": booking.id
                },
                status=status.HTTP_200_OK
            )

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
        
class MyBookingsView(ListAPIView):
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user)
