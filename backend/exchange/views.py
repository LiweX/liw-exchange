from rest_framework import generics, permissions
from rest_framework.response import Response
from .models import Card, ExchangeProposal
from .serializers import CardSerializer, ExchangeProposalSerializer
from django.db import models, transaction

class CardListCreateView(generics.ListCreateAPIView):
    queryset = Card.objects.all()
    serializer_class = CardSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.is_superuser:
            return Card.objects.all()
        return Card.objects.filter(owner=user)

    def perform_create(self, serializer):
        # Asignar automáticamente el owner como el usuario que hace la request
        serializer.save(owner=self.request.user)

class ExchangeProposalListCreateView(generics.ListCreateAPIView):
    queryset = ExchangeProposal.objects.all()
    serializer_class = ExchangeProposalSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Mostrar propuestas hechas y recibidas por el usuario
        return ExchangeProposal.objects.filter(
            models.Q(proposer=self.request.user) |
            models.Q(requested_card__owner=self.request.user)
        )

    def perform_create(self, serializer):
        # Ya lo hace el serializer, pero se puede reforzar acá también
        serializer.save(proposer=self.request.user)


class ExchangeProposalDetailView(generics.RetrieveUpdateAPIView):
    queryset = ExchangeProposal.objects.all()
    serializer_class = ExchangeProposalSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # El usuario puede ver/modificar si es proposer o dueño de la carta solicitada
        return ExchangeProposal.objects.filter(
            models.Q(proposer=self.request.user) |
            models.Q(requested_card__owner=self.request.user)
        )

    def update(self, request, *args, **kwargs):
        print('DEBUG: Entrando a update de ExchangeProposalDetailView')
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        prev_status = instance.status
        print(f'DEBUG: Propuesta {instance.id} status antes: {prev_status}')
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        print(f'DEBUG: Propuesta {instance.id} status despues: {serializer.instance.status}')
        # Si el status cambió a accepted, hacer el intercambio
        if prev_status != 'accepted' and serializer.instance.status == 'accepted':
            print('DEBUG: Ejecutando intercambio de ownership')
            with transaction.atomic():
                offered_card = Card.objects.select_for_update().get(pk=instance.offered_card.pk)
                requested_card = Card.objects.select_for_update().get(pk=instance.requested_card.pk)
                offered_card_owner = offered_card.owner
                requested_card_owner = requested_card.owner
                offered_card.owner_id = requested_card_owner.id
                requested_card.owner_id = offered_card_owner.id
                offered_card.forTrade = False
                requested_card.forTrade = False
                offered_card.save(update_fields=["owner", "forTrade"])
                requested_card.save(update_fields=["owner", "forTrade"])
                print(f'DEBUG: offered_card.owner={offered_card.owner}, requested_card.owner={requested_card.owner}')
                ExchangeProposal.objects.filter(
                    models.Q(status='pending'),
                    (
                        models.Q(offered_card=offered_card) |
                        models.Q(requested_card=offered_card) |
                        models.Q(offered_card=requested_card) |
                        models.Q(requested_card=requested_card)
                    ),
                ).exclude(id=instance.id).update(status='rejected')
        instance.refresh_from_db()
        print('DEBUG: update finalizado')
        return Response(self.get_serializer(instance).data)

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
        user = self.request.user
        if user.is_staff or user.is_superuser:
            return Card.objects.all()
        return Card.objects.filter(owner=user)