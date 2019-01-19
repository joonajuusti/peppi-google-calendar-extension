let createEventButton = document.getElementById('createEvent');

const event = {
  'summary': 'Test Event',
  'location': 'Test Location',
  'description': 'Testing the calendar API through Chrome extension.',
  'start': {
    'dateTime': '2019-01-21T09:00:00+02:00',
    'timeZone': 'Europe/Helsinki'
  },
  'end': {
    'dateTime': '2019-01-21T17:00:00+02:00',
    'timeZone': 'Europe/Helsinki'
  }
};

createEventButton.onclick = () => {
  chrome.identity.getAuthToken(function(token) {
    if (chrome.runtime.lastError) {
        alert(chrome.runtime.lastError.message);
        return;
    }

    const init = {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(event)
    }

    fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', init)
      .then(response => response.json())
      .then(data => alert(JSON.stringify(data)))
      .catch(() => alert('error'));
});
}