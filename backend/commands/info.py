from datetime import datetime

def get_time() -> str:
    # Get current time
    now = datetime.now()

    # Format as H:M:S AM/PM
    current_time = now.strftime("%I:%M:%S %p")

    return current_time