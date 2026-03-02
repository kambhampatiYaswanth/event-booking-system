from rest_framework.generics import ListAPIView
from rest_framework.permissions import AllowAny
from django.utils import timezone
from datetime import timedelta

from .models import Event, Seat
from .serializers import EventSerializer, SeatSerializer


class EventListView(ListAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [AllowAny]


class EventSeatListView(ListAPIView):
    serializer_class = SeatSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        event_id = self.kwargs["event_id"]
        seats = Seat.objects.filter(event_id=event_id)

        LOCK_DURATION = timedelta(seconds=15)

        for seat in seats:
            if seat.is_locked and seat.locked_at:
                if timezone.now() - seat.locked_at > LOCK_DURATION:
                    seat.is_locked = False
                    seat.locked_by = None
                    seat.locked_at = None
                    seat.save()

        return seats

        