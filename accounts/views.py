from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
from django.contrib import messages
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.core.mail import send_mail
import random

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

        if password != confirm:
            messages.error(request, "Passwords do not match")
            return redirect("register")

        if User.objects.filter(username=username).exists():
            messages.error(request, "Username already exists")
            return redirect("register")

        if User.objects.filter(email=email).exists():
            messages.error(request, "Email is already in use")
            return redirect("register")

        User.objects.create_user(username=username, email=email, password=password)
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
            messages.error(request, "This email is not registered")
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
