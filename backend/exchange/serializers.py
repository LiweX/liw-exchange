from rest_framework import serializers
from .models import ExchangeProposal
from .models import Card

class CardSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')
    creator = serializers.ReadOnlyField(source='creator.username')

    class Meta:
        model = Card
        fields = ['id', 'owner', 'creator', 'name', 'description', 'verified', 'forTrade', 'image_url']

class ExchangeProposalSerializer(serializers.ModelSerializer):
    offered_card = CardSerializer(read_only=True)
    requested_card = CardSerializer(read_only=True)
    offered_card_id = serializers.PrimaryKeyRelatedField(queryset=Card.objects.all(), source='offered_card', write_only=True)
    requested_card_id = serializers.PrimaryKeyRelatedField(queryset=Card.objects.all(), source='requested_card', write_only=True)
    proposer = serializers.SerializerMethodField()

    class Meta:
        model = ExchangeProposal
        fields = [
            'id', 'proposer', 'offered_card', 'offered_card_id',
            'requested_card', 'requested_card_id', 'status', 'created_at'
        ]
        read_only_fields = ['id', 'proposer', 'created_at', 'offered_card', 'requested_card']

    def get_proposer(self, obj):
        return obj.proposer.username if obj.proposer else None

    def create(self, validated_data):
        # Asigna automáticamente el usuario autenticado como proposer
        validated_data['proposer'] = self.context['request'].user
        return super().create(validated_data)