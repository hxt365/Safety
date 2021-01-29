from django.urls import path

from . import views

app_name = 'auth'

urlpatterns = [
    path('facebook/', views.FacebookAuthView.as_view(), name='facebook'),
    path('refresh/', views.TokenRefreshView.as_view(), name='refresh'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
]
