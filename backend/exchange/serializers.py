from rest_framework import serializers
from .models import ExchangeProposal
from .models import Card

class CardSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')

    class Meta:
        model = Card
        fields = ['id', 'owner', 'name', 'description', 'available', 'image_url']

class ExchangeProposalSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExchangeProposal
        fields = ['id', 'proposer', 'offered_card', 'requested_card', 'status', 'created_at']
        read_only_fields = ['id', 'proposer', 'status', 'created_at']

    def create(self, validated_data):
        # Asigna automáticamente el usuario autenticado como proposer
        validated_data['proposer'] = self.context['request'].user
        return super().create(validated_data)