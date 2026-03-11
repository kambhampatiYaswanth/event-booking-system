from django.urls import path
from .views import CancelBookingView, LockSeatView, ConfirmBookingView, MyBookingsView, DownloadTicketView

urlpatterns = [
    path("lock-seat/", LockSeatView.as_view()),
    path("confirm-booking/", ConfirmBookingView.as_view()),
    path("my-bookings/", MyBookingsView.as_view()),
    path("download-ticket/<int:booking_id>/", DownloadTicketView.as_view()),
    path("cancel-booking/<int:booking_id>/", CancelBookingView.as_view()),
]