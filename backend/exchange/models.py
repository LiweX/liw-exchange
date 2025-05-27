from django.db import models
from django.conf import settings

class Card(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    creator = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='created_cards')
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    verified = models.BooleanField(default=False)  # Aprobada por admin
    forTrade = models.BooleanField(default=False)  # Disponible para intercambio
    image_url = models.URLField(max_length=500, null=True, blank=True)
    

    def __str__(self):
        return f"{self.name} - {self.owner.username}"

    def save(self, *args, **kwargs):
        if not self.creator:
            self.creator = self.owner
        super().save(*args, **kwargs)


class ExchangeProposal(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
    ]

    proposer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    offered_card = models.ForeignKey(Card, related_name='offered_proposals', on_delete=models.CASCADE)
    requested_card = models.ForeignKey(Card, related_name='requested_proposals', on_delete=models.CASCADE)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Proposal {self.id} - {self.status}"
