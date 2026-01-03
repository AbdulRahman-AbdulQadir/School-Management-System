from django.shortcuts import render
from accounts.models import CustomUser
from django.contrib.auth.decorators import login_required
from django.core.exceptions import PermissionDenied
from django.http import JsonResponse
from django.contrib import messages
import json
import uuid

# Create your views here.

def home(request):
    total_students = CustomUser.objects.filter(is_student=True, is_member_of_this_school=True).count()
    total_teachers = CustomUser.objects.filter(is_teacher=True, is_member_of_this_school=True).count()

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

    # Fetching Data
    pending_users_queryset = CustomUser.objects.filter(is_member_of_this_school=False).order_by('-date_joined')

    # Prepare data for JS (Search/Sort functionality)
    # We convert the queryset to a list of dictionaries
    pending_users_list = list(pending_users_queryset.values(
        'id', 'username', 'email', 'phone_number', 'date_joined', 'first_name', 'last_name'
    ))
    # Convert UUIDs and Dates to strings for JSON compatibility
    for user in pending_users_list:
        user['id'] = str(user['id'])
        user['date_joined'] = user['date_joined'].strftime('%Y-%m-%dT%H:%M:%S')
        user['full_name'] = f"{user['first_name']} {user['last_name']}".strip() or user['username']

    context = {
        "pending_count": pending_users_queryset.count(),
        "pending_students": pending_users_queryset.filter(is_student=True).count(),
        "pending_teachers": pending_users_queryset.filter(is_teacher=True).count(),
        "total_students": CustomUser.objects.filter(is_student=True, is_member_of_this_school=True).count(),
        "total_teachers": CustomUser.objects.filter(is_teacher=True, is_member_of_this_school=True).count(),
        "pending_users_json": pending_users_list, # For JS
    }
    return render(request, 'pages/admin_dashboard.html', context)
@login_required
def update_user_status(request):
    """API Endpoint to approve or reject users via AJAX"""
    if request.method == 'POST' and request.user.is_staff:
        data = json.loads(request.body)
        user_ids = [uuid.UUID(uid) for uid in data.get('user_ids', [])]
        action = data.get('action') # 'approve' or 'reject'

        if action == 'approve':
            CustomUser.objects.filter(id__in=user_ids).update(is_member_of_this_school=True)
            CustomUser.objects.filter(id__in=user_ids).update(is_active=True)
        elif action == 'reject':
            # You can either delete them or mark them as inactive
            CustomUser.objects.filter(id__in=user_ids).update(is_member_of_this_school=False)
            CustomUser.objects.filter(id__in=user_ids).update(is_active=False)
        
        return JsonResponse({'status': 'success'})
    return JsonResponse({'status': 'error'}, status=400)