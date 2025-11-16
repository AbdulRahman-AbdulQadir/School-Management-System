from django.shortcuts import render
from accounts.models import CustomUser
# Create your views here.

def home(request):
    total_students = CustomUser.objects.filter(is_student=True).count()
    total_teachers = CustomUser.objects.filter(is_teacher=True).count()

    context = {
        "total_students": total_students,
        "total_teachers": total_teachers,
    }
    return render(request, 'pages/home.html', context)