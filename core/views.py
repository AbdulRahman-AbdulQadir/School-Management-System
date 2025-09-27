from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.core.exceptions import PermissionDenied
from django.contrib import messages
# Create your views here.

def home(request):
    return render(request, 'pages/home.html', {})

@login_required(login_url='login')
def admin_dashboard(request):
    # allow only staff or superuser accounts
    if not (request.user.is_staff or request.user.is_superuser):
        messages.error(request, 'You do not have permission to access the admin dashboard.')
        return render(request, 'pages/home.html', {})
    return render(request, 'pages/admin_dashboard.html', {})