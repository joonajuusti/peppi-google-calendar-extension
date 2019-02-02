function expandStudyTimes(collapseLinkText) {
  const collapseLink = $("a:contains(" + collapseLinkText + ")")[0];
  if (collapseLink) {
    collapseLink.click();
  }    
}

function findElementByText(string) {
  const text = $("h6:contains(" + string + ")")
    .siblings()
    .find("div:first-child")
    .text();
  return text;
}

function formatDateTime(date, time) {
  splitDate = date.split('.')
  return `${splitDate[2]}-${splitDate[1]}-${splitDate[0]}T${time}:00`
}

function parseEventObject(string) {
  const splitString = string.trim().split(' ');
  const location = `${splitString[3]} ${splitString[4]}`
  const startAndEndTimes = splitString[2].split('-').map(time => formatDateTime(splitString[1], time));
  return {
    summary: 'Test',
    location,
    start: {
      dateTime: startAndEndTimes[0],
      timeZone: 'Europe/Helsinki'
    },
    end: {
      dateTime: startAndEndTimes[1],
      timeZone: 'Europe/Helsinki'
    }
  };
}

expandStudyTimes('Näytä lisää');
var text = findElementByText('Opetusajat');
var splitText = text.split('  ');
var eventObjects = splitText.map(parseEventObject)
console.log(eventObjects);

chrome.runtime.sendMessage({data: eventObjects});