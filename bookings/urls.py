from django.urls import path
from .views import ConfirmBookingView, LockSeatView
from .views import LockSeatView, ConfirmBookingView, MyBookingsView

urlpatterns = [
    path('lock-seat/', LockSeatView.as_view(), name='lock-seat'),
    path('confirm-booking/', ConfirmBookingView.as_view(), name='confirm-booking'),
    path('my-bookings/', MyBookingsView.as_view(), name='my-bookings'),
]

