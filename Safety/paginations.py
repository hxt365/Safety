from rest_framework.pagination import PageNumberPagination


class LargeResultsSetPagination(PageNumberPagination):
    page_size = 20


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10


class SmallResultsSetPagination(PageNumberPagination):
    page_size = 5
