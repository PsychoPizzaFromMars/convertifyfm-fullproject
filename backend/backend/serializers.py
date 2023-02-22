from rest_framework import serializers
from .api import _unixtimestamp_now


class LastfmTracklistSerializer(serializers.Serializer):
    artist = serializers.CharField()
    track = serializers.CharField()


class LastfmTopTracksSerializer(serializers.Serializer):
    user_id = serializers.CharField(required=True, max_length=256)
    period = serializers.ChoiceField(
        choices=["overall", "7day", "1month", "3month", "6month", "12month"],
        default="overall",
    )
    limit = serializers.IntegerField(min_value=10, max_value=1000, default=50)
    page = serializers.IntegerField(min_value=1, default=1)


class LastfmWeeklyChartsSerializer(serializers.Serializer):
    user_id = serializers.CharField(required=True, max_length=256)
    date_from = serializers.IntegerField(default=946674000)
    date_to = serializers.IntegerField(default=_unixtimestamp_now())
    limit = serializers.IntegerField(min_value=10, max_value=1000, default=50)
    page = serializers.IntegerField(min_value=1, default=1)

    def validate(self, data):
        if not (data["date_from"] < data["date_to"]):
            raise serializers.ValidationError("Wrong date range")
        return data


class SpotifyUserTopTracksSerializer(serializers.Serializer):
    time_range = serializers.ChoiceField(
        choices=["long_term", "medium_term", "short_term"], default="medium_term"
    )
    limit = serializers.IntegerField(min_value=1, max_value=50, default=50)
