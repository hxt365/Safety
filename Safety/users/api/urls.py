from django.urls import path

from . import views

app_name = 'users'

urlpatterns = [
    path('<int:pk>/', views.UserRetrieveUpdateDestroyAPIView.as_view(), name='detail'),
    path('follow/<int:followee_id>/', views.FollowUserAPIView.as_view(), name='follow'),
]
