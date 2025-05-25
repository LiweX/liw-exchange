from django.urls import path
from .views import CardListCreateView, ExchangeProposalListCreateView, ExchangeProposalDetailView

urlpatterns = [
    path('cards/', CardListCreateView.as_view(), name='card-list-create'),
    path('proposals/', ExchangeProposalListCreateView.as_view(), name='proposal-list-create'),
    path('proposals/<int:pk>/', ExchangeProposalDetailView.as_view(), name='proposal-detail'),
]