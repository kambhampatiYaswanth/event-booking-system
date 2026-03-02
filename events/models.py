from django.db import models
from django.conf import settings
from django.utils import timezone


class Event(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    location = models.CharField(max_length=255)
    date_time = models.DateTimeField()
    total_seats = models.IntegerField()
    available_seats = models.IntegerField()
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )

    def __str__(self):
        return self.title


class Seat(models.Model):
    event = models.ForeignKey(
        Event,
        on_delete=models.CASCADE,
        related_name="seats"
    )
    seat_number = models.CharField(max_length=10)
    is_available = models.BooleanField(default=True)
    is_locked = models.BooleanField(default=False)
    locked_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL
    )
    locked_at = models.DateTimeField(null=True, blank=True)
    is_booked = models.BooleanField(default=False)

    class Meta:
        unique_together = ('event', 'seat_number')
        ordering = ['seat_number'] 
        indexes = [
            models.Index(fields=['event', 'seat_number']),
            models.Index(fields=['locked_by']),
        ]

    def __str__(self):
        return f"{self.event.title} - {self.seat_number}"