from django.db import models
from users.models import User
from events.models import Event, Seat


class Booking(models.Model):

    STATUS_CHOICES = (
        ("CONFIRMED", "Confirmed"),
        ("CANCELLED", "Cancelled"),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    event = models.ForeignKey(Event, on_delete=models.CASCADE)

    seats = models.ManyToManyField(Seat)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="CONFIRMED")

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Booking {self.id} - {self.user.email}"