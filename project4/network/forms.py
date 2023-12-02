from django.forms import ModelForm
from django.forms.widgets import Textarea
from .models import Post


class NewPostForm(ModelForm):
    class Meta:
        model = Post
        fields = ["text"]
        widgets = {
            "text": Textarea(attrs={
                "class": "form-control",
                "rows": 5,
                "placeholder": "Write something!"
            })
        }
