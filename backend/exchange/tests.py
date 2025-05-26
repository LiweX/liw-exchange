from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import Card, ExchangeProposal

User = get_user_model()

class CardTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_create_card(self):
        url = reverse('card-list-create')
        data = {'name': 'Carta1', 'description': 'desc', 'image_url': 'http://img.com/1.png'}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Card.objects.count(), 1)
        self.assertEqual(Card.objects.get().name, 'Carta1')

    def test_offer_card_for_trade(self):
        card = Card.objects.create(owner=self.user, name='Carta2', description='desc')
        url = reverse('card-detail', args=[card.id])
        response = self.client.patch(url, {'forTrade': True})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        card.refresh_from_db()
        self.assertTrue(card.forTrade)

class ExchangeProposalTests(APITestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(username='user1', password='pass1')
        self.user2 = User.objects.create_user(username='user2', password='pass2')
        self.card1 = Card.objects.create(owner=self.user1, name='C1', description='d1', verified=True, forTrade=True)
        self.card2 = Card.objects.create(owner=self.user2, name='C2', description='d2', verified=True, forTrade=True)
        self.client = APIClient()
        self.client.force_authenticate(user=self.user1)

    def test_create_exchange_proposal(self):
        url = reverse('proposal-list-create')
        data = {
            'offered_card': self.card1.id,
            'requested_card': self.card2.id
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(ExchangeProposal.objects.count(), 1)
        proposal = ExchangeProposal.objects.get()
        self.assertEqual(proposal.proposer, self.user1)
        self.assertEqual(proposal.offered_card, self.card1)
        self.assertEqual(proposal.requested_card, self.card2)

    def test_list_my_proposals(self):
        ExchangeProposal.objects.create(proposer=self.user1, offered_card=self.card1, requested_card=self.card2)
        url = reverse('proposal-list-create')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

class OfferedCardsListViewTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        Card.objects.create(owner=self.user, name='C1', description='d1', verified=True, forTrade=True)
        Card.objects.create(owner=self.user, name='C2', description='d2', verified=False, forTrade=True)
        Card.objects.create(owner=self.user, name='C3', description='d3', verified=True, forTrade=False)

    def test_list_offered_cards(self):
        url = reverse('offered-cards-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], 'C1')
