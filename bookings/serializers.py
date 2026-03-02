from rest_framework import serializers
from .models import Booking
from events.models import Event, Seat


class SeatMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = Seat
        fields = ["id", "seat_number"]


class EventMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ["id", "title", "location", "date_time"]


class BookingSerializer(serializers.ModelSerializer):
    seat = SeatMiniSerializer(read_only=True)
    event = EventMiniSerializer(read_only=True)

    class Meta:
        model = Booking
        fields = "__all__"