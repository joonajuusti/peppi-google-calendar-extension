const createEventButton = document.getElementById('createEvent');
const loaderDiv = document.getElementById('loader');
const statusInfo = document.getElementById('statusInfo');

createEventButton.onclick = () => {
  createEventButton.style.display = 'none';
  loaderDiv.classList.add('loader');
  chrome.identity.getAuthToken(token => {
    if (chrome.runtime.lastError) {
      loaderDiv.classList.remove('loader');
      createEventButton.style.display = 'inline-block';
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
        loaderDiv.classList.remove('loader');
        statusInfo.innerHTML = 'Done!';
      }
    );

    chrome.tabs.executeScript({
      file: 'schedule.js'
    });
  });
}