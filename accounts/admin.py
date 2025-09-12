from django.contrib import admin
from .models import CustomUser
# Register your models here.
admin.site.site_header = "School Management System Admin"
admin.site.site_title = "School Management System Admin Portal"
admin.site.index_title = "Welcome to School Management System Admin Portal"
admin.site.register(CustomUser)