from django.db import transaction
from django.utils import timezone
from events.models import Seat
from bookings.models import Booking
from events.models import Event
from bookings.models import Booking
from django.db import transaction

LOCK_TIMEOUT_SECONDS = 300  # 5 minutes


from events.models import Seat
from django.utils import timezone


from events.models import Seat
from django.utils import timezone


def lock_seat(user, seat_id):

    seat = Seat.objects.get(id=seat_id)

    # If seat already booked
    if seat.is_booked:
        raise Exception("Seat already booked")

    # If seat locked by another user
    if seat.is_locked and seat.locked_by != user:
        raise Exception("Seat already locked by another user")

    # Allow same user to re-lock seat
    seat.is_locked = True
    seat.locked_by = user
    seat.locked_at = timezone.now()
    seat.save()

    return seat
def confirm_booking(user, seat_id, price=100):

    with transaction.atomic():

        seat = Seat.objects.select_for_update().get(id=seat_id)

        # Check seat is locked
        if not seat.locked_by:
            raise Exception("Seat is not locked")

        # Check locked by same user
        if seat.locked_by != user:
            raise Exception("You do not own this seat lock")

        # Check lock expiration
        if is_lock_expired(seat):
            raise Exception("Seat lock has expired")

        event = seat.event

        # Create booking
        booking = Booking.objects.create(
            user=user,
            event=event,
            status='CONFIRMED',
            total_price=price
        )

        booking.seats.add(seat)

        # Mark seat permanently booked
        seat.is_booked = True
        seat.locked_by = None
        seat.locked_at = None
        seat.save()

        # Reduce available seats
        event.available_seats -= 1
        event.save()

        return booking

def is_lock_expired(seat):
    if not seat.locked_at:
        return True

    time_diff = (timezone.now() - seat.locked_at).total_seconds()

    return time_diff > LOCK_TIMEOUT_SECONDS
