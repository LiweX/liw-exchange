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
            'offered_card_id': self.card1.id,
            'requested_card_id': self.card2.id
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

class UserProfileTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpass', first_name='Nombre', last_name='Apellido')
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_get_profile(self):
        url = '/users/me/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['first_name'], 'Nombre')
        self.assertEqual(response.data['last_name'], 'Apellido')

    def test_update_profile(self):
        url = '/users/me/'
        response = self.client.patch(url, {'first_name': 'Nuevo', 'last_name': 'Nombre'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertEqual(self.user.first_name, 'Nuevo')
        self.assertEqual(self.user.last_name, 'Nombre')

class AdminCardTests(APITestCase):
    def setUp(self):
        self.admin = User.objects.create_superuser(username='admin', password='adminpass')
        self.user = User.objects.create_user(username='user', password='userpass')
        self.card = Card.objects.create(owner=self.user, name='Carta', description='desc', verified=False)
        self.client = APIClient()
        self.client.force_authenticate(user=self.admin)

    def test_admin_can_see_all_cards(self):
        url = reverse('card-list-create')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(any(c['id'] == self.card.id for c in response.data))

    def test_admin_can_verify_and_delete_card(self):
        url = reverse('card-detail', args=[self.card.id])
        response = self.client.patch(url, {'verified': True})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.card.refresh_from_db()
        self.assertTrue(self.card.verified)
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Card.objects.filter(id=self.card.id).exists())

class ExchangeFlowTests(APITestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(username='user1', password='pass1')
        self.user2 = User.objects.create_user(username='user2', password='pass2')
        self.card1 = Card.objects.create(owner=self.user1, name='C1', description='d1', verified=True, forTrade=True)
        self.card2 = Card.objects.create(owner=self.user2, name='C2', description='d2', verified=True, forTrade=True)
        self.client = APIClient()
        self.client.force_authenticate(user=self.user1)

    def test_propose_and_accept_exchange(self):
        # Proponer intercambio
        url = reverse('proposal-list-create')
        data = {'offered_card_id': self.card1.id, 'requested_card_id': self.card2.id}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        proposal_id = response.data['id']
        # Cambiar a user2 para aceptar
        self.client.force_authenticate(user=self.user2)
        url_detail = reverse('proposal-detail', args=[proposal_id])
        response = self.client.patch(url_detail, {'status': 'accepted'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Verificar que se intercambiaron los owners
        self.card1.refresh_from_db()
        self.card2.refresh_from_db()
        self.assertEqual(self.card1.owner, self.user2)
        self.assertEqual(self.card2.owner, self.user1)
        # Verificar que ambas cartas ya no están para intercambio
        self.assertFalse(self.card1.forTrade)
        self.assertFalse(self.card2.forTrade)
        # Verificar que la propuesta quedó aceptada
        proposal = ExchangeProposal.objects.get(id=proposal_id)
        self.assertEqual(proposal.status, 'accepted')

class TradeModalLogicTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='user', password='pass')
        self.card1 = Card.objects.create(owner=self.user, name='C1', description='d1', verified=True, forTrade=True)
        self.card2 = Card.objects.create(owner=self.user, name='C2', description='d2', verified=False, forTrade=True)
        self.card3 = Card.objects.create(owner=self.user, name='C3', description='d3', verified=True, forTrade=False)
        self.other = User.objects.create_user(username='other', password='pass')
        self.card4 = Card.objects.create(owner=self.other, name='C4', description='d4', verified=True, forTrade=True)
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_only_my_verified_fortrade_cards(self):
        url = reverse('card-list-create')
        response = self.client.get(url)
        # Simula el filtro del modal: solo mis cartas, verificadas y forTrade
        filtered = [c for c in response.data if c['verified'] and c['forTrade'] and c['owner'] == self.user.username]
        self.assertEqual(len(filtered), 1)
        self.assertEqual(filtered[0]['id'], self.card1.id)
