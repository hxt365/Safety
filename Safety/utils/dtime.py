from django.db.models import functions


def duration_to_hours(duration):
    days = functions.ExtractDay(duration)
    hours = functions.ExtractHour(duration)
    minutes = functions.ExtractMinute(duration)
    seconds = functions.ExtractSecond(duration)

    total_hours = days * 24 + hours + minutes / 60.0 + seconds / 3600.0
    return total_hours