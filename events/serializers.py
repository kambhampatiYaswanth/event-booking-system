from rest_framework import serializers
from .models import Event
from .models import Seat
from django.utils import timezone
from rest_framework import serializers
from .models import Seat

class EventSerializer(serializers.ModelSerializer):

    seats_left = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = "__all__"

    def get_seats_left(self, obj):
        total_seats = obj.seats.count()
        booked_seats = obj.seats.filter(is_booked=True).count()
        return total_seats - booked_seats
    
class SeatSerializer(serializers.ModelSerializer):
    locked_by = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Seat
        fields = "__all__"

    def get_is_available(self, obj):
        if obj.is_booked:
            return False

        if obj.locked_by:
            time_diff = (timezone.now() - obj.locked_at).total_seconds()
            if time_diff < 120:
                return False

        return True