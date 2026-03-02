from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Event, Seat


@receiver(post_save, sender=Event)
def create_seats(sender, instance, created, **kwargs):
    if created:
        seats = []
        for i in range(1, instance.total_seats + 1):
            seats.append(
                Seat(
                    event=instance,
                    seat_number=f"A{i}"
                )
            )
        Seat.objects.bulk_create(seats)
