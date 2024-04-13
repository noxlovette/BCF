from django.test import TestCase
import requests


class CollectionAPITest(TestCase):
    """
    test the CollectionAPI
    """
    def test_search_param_in_request(self):
        # Simulate a GET request with query parameters
        response = self.client.get('/collection/api/collection/3/', {'search': 'Aldehyde'})

        # Check if the request was successful (status code 200)
        self.assertEqual(response.status_code, 200)

        # Access the request object from the response
        request = response.wsgi_request

        # Access the query parameters from the request
        search_param = request.GET.get('search', None)

        # Assert that the search parameter is present and has the expected value
        self.assertEqual(search_param, 'Aldehyde')

    def test_fetch_data_with_search_param(self):
        url = 'http://localhost:8000/collection/api/collection/3/'
        params = {'search': 'Aldehyde'}

        # Make a GET request to the API endpoint
        response = requests.get(url, params=params)

        # Check if the request was successful (status code 200)
        self.assertEqual(response.status_code, 200)

        # Check if the response contains the expected data
        json_data = response.json()
        self.assertTrue(json_data)  # Check if response is not empty

        # Check if the response contains the expected common_name and cas
        expected_common_name = "Aldehyde C 16"
        expected_cas = "77-83-8"
        self.assertEqual(json_data['common_name'], expected_common_name)
        self.assertEqual(json_data['cas'], expected_cas)

    def test_data_without_search_param(self):
        url = 'http://localhost:8000/collection/api/collection/3/'

        # Make a GET request to the API endpoint
        response = requests.get(url)

        # Check if the request was successful (status code 200)
        self.assertEqual(response.status_code, 200)

        # Check if the response contains the expected data
        json_data = response.json()
        self.assertTrue(json_data)  # Check if response is not empty

        json_data = response.json()
        self.assertIsInstance(json_data, list)
        self.assertGreater(len(json_data), 0)

    def test_data_empty_collection(self):
        url = 'http://localhost:8000/collection/api/collection/1/'

        # Make a GET request to the API endpoint
        response = requests.get(url)

        # Check if the request was successful (status code 200)
        self.assertEqual(response.status_code, 200)

        # Check if the response contains the expected data
        json_data = response.json()
        self.assertTrue(json_data)  # Check if response is not empty

        empty_ingredient = {
            'ingredient': '',
            'ingredient.cas': '',
            'ingredient.volatility': '',
            'ingredient.use': '',
            'amount': '',
            'colour': '',
            'impression': '',
            'date_added': '',
            'is_collection': False
        }

        self.assertEqual(json_data, empty_ingredient)