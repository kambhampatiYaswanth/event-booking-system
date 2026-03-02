from django.urls import path
from .views import EventListView, EventSeatListView

urlpatterns = [
    path('', EventListView.as_view(), name='event-list'),
    path('<int:event_id>/seats/', EventSeatListView.as_view(), name='event-seats'),
]
