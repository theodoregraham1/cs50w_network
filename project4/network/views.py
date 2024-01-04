from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.utils.datastructures import MultiValueDictKeyError

from .models import User, Post
from .forms import NewPostForm


def index(request):
    return render(request, "network/index.html", {
        "form": NewPostForm,
    })


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            messages.error(request, "Invalid username and/or password.")
            return render(request, "network/login.html")
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            messages.error(request, "Passwords must match.")
            return render(request, "network/register.html")

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            messages.error(request, "Username already taken")

            return render(request, "network/register.html")

        messages.success(request, "Registration successful")
        login(request, user)

        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")


def new_post(request):
    if request.method == "POST":
        form = NewPostForm(request.POST)

        if not form.is_valid():
            messages.error(request, "Post invalid")
            return render(request, "network/index.html", {
                "form": form,
            })

        post = Post(user=request.user, text=form.cleaned_data["text"])
        post.save()

        messages.success(request, "Post created successfully")

    return HttpResponseRedirect(reverse("index"))


def get_posts(request):
    posts = Post.objects.all()
    posts = posts.order_by("-timestamp")
    return JsonResponse([post.serialise() for post in posts], status=201, safe=False)


def get_user_posts(request, profile_id):
    # Returns the posts from a specific user

    try:
        profile = User.objects.get(id=profile_id)
    except User.DoesNotExist:
        return JsonResponse([], status=500)

    posts = profile.posts
    posts = posts.order_by("-timestamp")

    return JsonResponse([post.serialise() for post in posts], status=201, safe=False)


def get_following_posts(request):
    if not request.user.is_authenticated:
        return HttpResponseRedirect(reverse("index"))

    following = request.user.following.all()

    posts = []
    for user in following:
        posts.extend(user.posts.all())

    print(posts)
    posts.sort(key=(lambda post: post.timestamp))
    posts.reverse()

    return JsonResponse([post.serialise() for post in posts], status=201, safe=False)


def profile_view(request, username):
    try:
        profile_user = User.objects.get(username=username)
    except User.DoesNotExist:
        return HttpResponseRedirect(reverse("index"))

    return render(request, "network/profile.html", {
        "profile": profile_user,
        "followers_num": len(profile_user.followers.all()),
        "following_num": len(profile_user.following.all()),
        "following": request.user in profile_user.followers.all(),
    })


def follow(request, id):
    # If the user is not following the profile of 'id' then follows them, else unfollows them
    if not request.user.is_authenticated:
        return JsonResponse({}, status=511)

    # Get profile user
    try:
        user = User.objects.get(id=id)
    except User.DoesNotExist:
        return JsonResponse({}, status=500)

    # Follow or unfollow
    if request.user in user.followers.all():
        user.followers.remove(request.user)
    else:
        user.followers.add(request.user)

    return JsonResponse({"following": request.user in user.followers.all()}, status=201)


def following_view(request):
    return render(request, "network/following.html", {
        "form": NewPostForm,
    })


def edit_post(request):
    # Ensure the user is logged in
    if not request.user.is_authenticated:
        return JsonResponse({}, status=511)

    # Ensure correct method used
    if request.method != "POST":
        return JsonResponse({}, status=500)

    data = request.POST

    # Get post
    try:
        post = Post.objects.get(id=data["post_id"])
    except MultiValueDictKeyError:
        return JsonResponse({}, status=500)
    except Post.DoesNotExist:
        return JsonResponse({}, status=500)

    # Check whether the user is the one who made the post
    if post.user != request.user:
        return JsonResponse({}, status=511)

    post.text = data["text"]
    post.save()

    return JsonResponse(post.serialise(), status=201)
