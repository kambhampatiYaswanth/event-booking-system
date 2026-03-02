from rest_framework import serializers
from .models import Event
from .models import Seat
from django.utils import timezone
from rest_framework import serializers
from .models import Seat

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = "__all__"


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