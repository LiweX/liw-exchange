from rest_framework import generics, permissions
from .models import Card, ExchangeProposal
from .serializers import CardSerializer, ExchangeProposalSerializer

class CardListCreateView(generics.ListCreateAPIView):
    queryset = Card.objects.all()
    serializer_class = CardSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Solo listar las cards del usuario autenticado
        return Card.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        # Asignar automáticamente el owner como el usuario que hace la request
        serializer.save(owner=self.request.user)

class ExchangeProposalListCreateView(generics.ListCreateAPIView):
    queryset = ExchangeProposal.objects.all()
    serializer_class = ExchangeProposalSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Solo listar las propuestas del usuario autenticado
        return ExchangeProposal.objects.filter(proposer=self.request.user)

    def perform_create(self, serializer):
        # Ya lo hace el serializer, pero se puede reforzar acá también
        serializer.save(proposer=self.request.user)


class ExchangeProposalDetailView(generics.RetrieveUpdateAPIView):
    queryset = ExchangeProposal.objects.all()
    serializer_class = ExchangeProposalSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # El usuario solo puede ver/modificar sus propuestas
        return ExchangeProposal.objects.filter(proposer=self.request.user)

class OfferedCardsListView(generics.ListAPIView):
    serializer_class = CardSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Solo cartas verificadas y marcadas para intercambio
        return Card.objects.filter(verified=True, forTrade=True)

class CardDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Card.objects.all()
    serializer_class = CardSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Solo el dueño puede modificar su carta
        return Card.objects.filter(owner=self.request.user)