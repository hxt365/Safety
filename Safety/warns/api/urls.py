from django.urls import path

from . import views

app_name = 'warnings'

urlpatterns = [
    path('', views.WarningListCreateAPIView.as_view(), name='list'),
    path('users/<int:uid>/', views.UsersWarningListCreateAPIView.as_view(), name='user'),
    path('<int:pk>/', views.WarningRetrieveDestroyAPIView.as_view(), name='detail'),
    path('<int:pk>/upvote/', views.WarningUpvoteAPIView.as_view(), name='upvote'),
    path('<int:pk>/devote/', views.WarningDevoteAPIView.as_view(), name='devote'),
    path('<int:warning_id>/comments/', views.CommentListCreateAPIView.as_view(), name='comments'),
]
