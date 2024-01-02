
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("add", views.new_post, name="add"),
    path("posts", views.get_posts, name="posts"),
    path("user/<str:username>", views.profile_view, name="profile"),
    path("follow/<int:id>", views.follow, name="follow"),
    path("user/<int:profile_id>/posts", views.get_user_posts, name="user_posts")
]
