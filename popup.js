const createEventButton = document.getElementById('createEvent');

createEventButton.onclick = () => {
  chrome.identity.getAuthToken(token => {
    if (chrome.runtime.lastError) {
        alert('Something went wrong. Please make sure that you have logged in with your Google account.');
        return;
    }

    const init = {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    };

    chrome.runtime.onMessage.addListener(
      request => {
        const eventObjects = request.data;
        const promises = eventObjects.map(eventObject => (
          fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', { ...init, body: JSON.stringify(eventObject)}))
        );
        Promise.all(promises)
          .then(() => alert('Added lecture times successfully to your Google Calendar.')
          .catch(() => alert('Something went wrong when adding the events to your Google Calendar.')));
      }
    );

    chrome.tabs.executeScript({
      file: 'schedule.js'
    });
  });
}