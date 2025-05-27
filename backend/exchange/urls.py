from django.urls import path
from .views import CardListCreateView, CardDetailView, ExchangeProposalListCreateView, ExchangeProposalDetailView, OfferedCardsListView

urlpatterns = [
    path('cards/', CardListCreateView.as_view(), name='card-list-create'),
    path('cards/<int:pk>/', CardDetailView.as_view(), name='card-detail'),
    path('proposals/', ExchangeProposalListCreateView.as_view(), name='proposal-list-create'),
    path('proposals/<int:pk>/', ExchangeProposalDetailView.as_view(), name='proposal-detail'),
    path('offers/', OfferedCardsListView.as_view(), name='offered-cards-list'),
]