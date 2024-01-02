
from django.urls import path

from . import views

urlpatterns = [
    # User reachable
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("user/<str:username>", views.profile_view, name="profile"),
    path("following", views.following_view, name="following"),

    # Get posts
    path("user/<int:profile_id>/posts", views.get_user_posts, name="user_posts"),
    path("posts/following", views.get_following_posts, name="following_posts"),
    path("posts", views.get_posts, name="posts"),

    # Update data
    path("add", views.new_post, name="add"),
    path("follow/<int:id>", views.follow, name="follow"),
]
