const createEventButton = document.getElementById('createEvent');

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
      }
    }

    chrome.runtime.onMessage.addListener(
      function(request) {
        const data = request.data;
        data.forEach(data => {
          fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', { ...init, body: JSON.stringify(data)})
            .then(response => response.json())
            .catch(() => alert('error'));
        });
      }
    );

    chrome.tabs.executeScript({
      file: 'schedule.js'
    });
  });
}