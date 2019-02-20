const createEventButton = document.getElementById('createEvent');
const loaderDiv = document.getElementById('loader');
const statusInfo = document.getElementById('statusInfo');
const colorSelection = document.getElementById('colorSelection');
const colors = [
  {
    key: '1',
    name: 'Lavender',
    background: "#a4bdfc",
  },
  {
    key: '2',
    name: 'Sage',
    background: "#7ae7bf",
  },
  {
    key: '3',
    name: 'Grape',
    background: "#dbadff",
  },
  {
    key: '4',
    name: 'Flamingo',
    background: "#ff887c",
  },
  {
    key: '5',
    name: 'Banana',
    background: "#fbd75b",
  },
  {
    key: '6',
    name: 'Tangerine',
    background: "#ffb878",
  },
  {
    key: '7',
    name: 'Peacock',
    background: "#46d6db",
  },
  {
    key: '8',
    name: 'Graphite',
    background: "#e1e1e1",
  },
  {
    key: '9',
    name: 'Blueberry',
    background: "#5484ed",
  },
  {
    key: '10',
    name: 'Basil',
    background: "#51b749",
  },
  {
    key: '11',
    name: 'Tomato',
    background: "#dc2127",
  }
];

for (const color of colors) {
  const option = document.createElement('option');
  option.text = color.name;
  option.style.background = color.background;
  colorSelection.add(option);
}


createEventButton.onclick = () => {
  createEventButton.style.display = 'none';
  colorSelection.style.display = 'none';
  loaderDiv.classList.add('loader');
  chrome.identity.getAuthToken({interactive: true}, token => {
    if (chrome.runtime.lastError) {
      loaderDiv.classList.remove('loader');
      createEventButton.style.display = 'inline-block';
      colorSelection.style.display = 'inline-block';
      alert(JSON.stringify(chrome.runtime.lastError.message))
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
      const colorKey = colors[colorSelection.selectedIndex].key
      await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', { ...init, body: JSON.stringify({ ...eventObject, colorId: colorKey })});
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