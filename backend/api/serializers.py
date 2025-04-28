from django.contrib.auth.models import User
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):

    # This class defines how the serializer works
    class Meta:

        # Use the built in User model
        model = User

        # Fields we want exposed through the API
        fields = ["id", "username", "password"]

        # Makes sure the password field can only be written and wont be sent back as an API response
        extra_kwargs = {"password": {"write_only": True}}

    # Overrides the default behaviour of ModelSerializer.create()
    def create(self, validated_data):
        print(validated_data)

        # Creates a User model from the validated data
        user = User.objects.create_user(**validated_data)
        return user
