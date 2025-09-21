from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
from django.contrib import messages
from django.contrib.auth import get_user_model, update_session_auth_hash
from django.contrib.auth.decorators import login_required
from django.core.mail import send_mail
from django.db import transaction
import random

User = get_user_model()

def login(request):
    if request.method == "POST":
        email = request.POST.get("email")
        password = request.POST.get("password")
        try:
            user_obj = User.objects.get(email=email)
            user = authenticate(request, username=user_obj.username, password=password)        
            if user is not None:
                auth_login(request, user)  
                return redirect("home")
            else:
                messages.error(request, "Incorrect password")
        except User.DoesNotExist:
            messages.error(request, "This email is not registered")
            return redirect("login")
    return render(request, "accounts/login.html")

def register(request):
    if request.method == "POST":
        username = request.POST.get("username")
        email = request.POST.get("email")
        password = request.POST.get("password")
        confirm = request.POST.get("confirm_password")
        user_role = request.POST.get("user_role")
        national_id = request.POST.get("national_id")
        phone_number = request.POST.get("phone_number")
        national_id_image = request.FILES.get("national_id_image")

        if password != confirm:
            messages.error(request, "Passwords do not match")
            return redirect("register")

        if User.objects.filter(username=username).exists():
            messages.error(request, "Username already exists")
            return redirect("register")

        if User.objects.filter(email=email).exists():
            messages.error(request, "Email is already in use")
            return redirect("register")

        if User.objects.filter(national_id=national_id).exists():
            messages.error(request, "National ID already exists")
            return redirect("register")

        if User.objects.filter(phone_number=phone_number).exists():
            messages.error(request, "Phone number already exists")
            return redirect("register")

        if user_role not in ['student', 'teacher', 'parent', 'admin']:
            messages.error(request, "Invalid role selected")
            return redirect("register")
        
        # use transaction to ensure atomicity(submit all or none)
        with transaction.atomic():
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password,
                national_id=national_id,
                phone_number=phone_number,
            )
            if national_id_image:
                user.national_id_image = national_id_image
            if user_role == 'student':
                user.is_student = True
            elif user_role == 'teacher':
                user.is_teacher = True
            elif user_role == 'parent':
                user.is_parent = True
            elif user_role == 'admin':
                user.is_staff = True
            user.save()
        messages.success(request, "Account created successfully! You can now log in.")
        return redirect("login")

    return render(request, "accounts/register.html")

def logout(request):
    auth_logout(request)
    messages.success(request, "You have logged out successfully!")
    return redirect("login")

def forgot_password(request):
    if request.method == "POST":
        email = request.POST.get("email")
        try:
            user = User.objects.get(email=email)
            code = str(random.randint(10000, 99999))
            request.session['reset_email'] = email
            request.session['reset_code'] = code
            # Send code to email
            send_mail(
                'Password Reset Code',
                f'Your reset code is: {code}',
                'noreply@yourdomain.com',
                [email],
                fail_silently=False,
            )
            return redirect('verify_code')
        except User.DoesNotExist:
            error = "This email is not registered"
            return render(request, 'accounts/forgot_password.html', {'error': error})
    return render(request, 'accounts/forgot_password.html')

def verify_code(request):
    if request.method == "POST":
        code = request.POST.get("code")
        if code == request.session.get('reset_code'):
            return redirect('reset_password')
        else:
            messages.error(request, "Invalid code")
    return render(request, 'accounts/verify_code.html')

def reset_password(request):
    if request.method == "POST":
        password = request.POST.get("password")
        confirm = request.POST.get("confirm_password")
        if password != confirm:
            messages.error(request, "Passwords do not match")
            return render(request, 'accounts/reset_password.html')
        else:
            email = request.session.get('reset_email')
            user = User.objects.get(email=email)
            user.set_password(password)
            user.save()
            messages.success(request, "Password has been reset successfully! You can now log in.")
            request.session.pop('reset_email', None)
            request.session.pop('reset_code', None)
            return redirect('login')
    return render(request, 'accounts/reset_password.html')


def profile(request):
    user = request.user
    if not user.is_authenticated:
        return redirect('login')
    return render(request, "accounts/profile.html", {"user": user})

@login_required
def profile_update(request):
    user = request.user
    if request.method == "POST":
        username = request.POST.get("username")
        email = request.POST.get("email")
        national_id = request.POST.get("national_id")
        phone_number = request.POST.get("phone_number")
        national_id_image = request.FILES.get("national_id_image")
        profile_image = request.FILES.get("profile_image")

        # Optionally add validation here

        user.username = username
        user.email = email
        user.national_id = national_id
        user.phone_number = phone_number
        if national_id_image:
            user.national_id_image = national_id_image
        if profile_image:
            user.profile_image = profile_image
        user.save()
        messages.success(request, "Profile updated successfully!")
        return redirect("profile")
    return render(request, "accounts/profile_update.html", {"user": user})

def update_password(request):
    if not request.user.is_authenticated:
        return redirect('login')
    if request.method == "POST":
        current_password = request.POST.get("current_password")
        new_password = request.POST.get("new_password")
        confirm_password = request.POST.get("confirm_password")

        if not request.user.check_password(current_password):
            messages.error(request, "Current password is incorrect")
            return redirect('update_password')

        if new_password != confirm_password:
            messages.error(request, "New passwords do not match")
            return redirect('update_password')
        
        if new_password == current_password:
            messages.error(request, "New password must be different from the current password")
            return redirect('update_password')

        if len(new_password) < 8:
            messages.error(request, "New password must be at least 8 characters long")
            return redirect('update_password')
        
        request.user.set_password(new_password)
        request.user.save()
        update_session_auth_hash(request, request.user)  # Keep the user logged in after password change
        messages.success(request, "Password updated successfully!")
        return redirect('profile')

    return render(request, 'accounts/update_password.html')