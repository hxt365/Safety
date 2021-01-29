from rest_framework_simplejwt.settings import api_settings


class AddAuthorizationHead:
    """
    Take access token from httpOnly cookies and put it into authorization header
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        cookies_str = request.META.get('HTTP_COOKIE', None)
        if cookies_str:
            cookies_dict = self.to_dict(cookies_str)
            access_token = cookies_dict.get('access_token', None)
            if access_token:
                request = self.set_access_token_for_request(request, access_token)
        response = self.get_response(request)
        return response

    def to_dict(self, string):
        """
        Convert a string like "abc=xyz;def=uvt" to a dict
        :param string:
        :return: dict
        """
        split_string = string.split('; ')
        phrases = [tmp.split('=', 1) for tmp in split_string]
        result = {k: v for [k, v] in phrases}
        return result

    def set_access_token_for_request(self, request, access_token):
        barrier = api_settings.AUTH_HEADER_TYPES[0]
        request.META['HTTP_AUTHORIZATION'] = '{barrier} {token}'.format(barrier=barrier, token=access_token)
        return request
