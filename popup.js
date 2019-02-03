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

    const postEvent = async eventObject => {
      await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', { ...init, body: JSON.stringify(eventObject)});
    }

    chrome.runtime.onMessage.addListener(
      async request => {
        const eventObjects = request.data;
        for (const eventObject of eventObjects) {
          await postEvent(eventObject);
        }
      }
    );

    chrome.tabs.executeScript({
      file: 'schedule.js'
    });
  });
}