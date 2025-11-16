from django.shortcuts import render
from accounts.models import CustomUser
from django.contrib.auth.decorators import login_required
from django.core.exceptions import PermissionDenied
from django.contrib import messages

# Create your views here.

def home(request):
    total_students = CustomUser.objects.filter(is_student=True).count()
    total_teachers = CustomUser.objects.filter(is_teacher=True).count()

    context = {
        "total_students": total_students,
        "total_teachers": total_teachers,
    }
    return render(request, 'pages/home.html', context)

@login_required(login_url='login')
def admin_dashboard(request):
    # allow only staff or superuser accounts
    if not (request.user.is_staff or request.user.is_superuser):
        messages.error(request, 'You do not have permission to access the admin dashboard.')
        return render(request, 'pages/home.html', {})

    # Count users who registered but are not yet approved by admin
    pending_count = CustomUser.objects.filter(is_member_of_this_school=False).count()
    
    context = {
        "pending_count": pending_count,
    }
    return render(request, 'pages/admin_dashboard.html', context)
