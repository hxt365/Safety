from django.contrib import admin

from .models import Warn, Photo, Comment


class PhotoInline(admin.TabularInline):
    model = Photo


class WarningAdmin(admin.ModelAdmin):
    model = Warn
    list_display = ['short_description', 'time']
    inlines = [PhotoInline, ]


admin.site.register(Warn, WarningAdmin)
admin.site.register(Comment)
admin.site.register(Photo)
