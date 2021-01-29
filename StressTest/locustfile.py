from datetime import datetime

from locust import HttpUser, task

ACCESS_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjA4NzYwMDg3LCJqdGkiOiJlNmIyYTdkYjk0ZWI0YzU3ODY1ZjdmZmE0NTdjNTdjZiIsInVzZXJfaWQiOjJ9.tPXXAyhiOwdrozmJYpX71520jSvkALoWAr4AYqB2CeM'


class WebsiteUser(HttpUser):
    def on_start(self):
        self.login()

    def login(self):
        self.client.cookies.set('access_token', ACCESS_TOKEN)

    @task
    def get_list_warnings(self):
        self.client.get('/api/warnings/')

    @task
    def create_warning(self):
        now = datetime.now()
        data = {'topic': 'AI',
                'short_description': 'something',
                'long_description': 'something long',
                'time': now,
                'location': 'POINT(0 0)'}
        self.client.post('/api/warnings/', data)
