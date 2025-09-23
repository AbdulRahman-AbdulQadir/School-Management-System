from django.shortcuts import render

# Create your views here.

def home(request):
    return render(request, 'pages/home.html', {})
def admin_dashboard(request):
    return render(request, 'pages/admin_dashboard.html', {})