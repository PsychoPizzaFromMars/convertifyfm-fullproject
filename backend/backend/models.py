from django.db import models

# Create your models here.


class SpotifyToken(models.Model):
    def __str__(self):
        return f"User session: {self.user}. Created at: {self.created_at}"

    user = models.CharField(max_length=50, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    refresh_token = models.CharField(max_length=300)
    access_token = models.CharField(max_length=300)
    expires_in = models.DateTimeField()
    token_type = models.CharField(max_length=50)
