from rest_framework import serializers
from .models import Todo

class TodoSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = Todo
        fields = [
            'id', 
            'title', 
            'description', 
            'status',
            'status_display',
            'created_at', 
            'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'status_display']