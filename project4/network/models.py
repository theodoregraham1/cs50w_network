from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone


class User(AbstractUser):
    followers = models.ManyToManyField("User", related_name="following")


class Post(models.Model):
    user = models.ForeignKey("User", related_name="posts", on_delete=models.CASCADE)
    text = models.TextField(max_length=300)
    timestamp = models.DateTimeField(auto_now=True)
    likes = models.ManyToManyField("User", related_name="liked")

    def serialise(self, user):
        return {
            "id": self.id,
            "username": self.user.username,
            "userid": self.user.id,
            "text": self.text,
            "timestamp": self.timestamp.strftime("%b %d %Y, %I:%M %p"),
            "likes": len(self.likes.all()),
            "liked": user in self.likes.all(),
        }
