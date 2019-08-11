expandStudyTimes = collapseLinkText => {
  for (el of document.querySelectorAll('div a')) {
    if (el.innerText === collapseLinkText) el.click()
    return
  }
}

findCourseName = () => {
  const courseInfo = document.querySelector('h4 span').innerText;
  const courseName = courseInfo.split(',')[0].split(' ').slice(1).join(' ');
  return courseName;
}

findStudyInfo = studyInfoHeading => {
  const studyInfo = []
  for (el of document.querySelectorAll('h6')) {
    if (el.innerText !== studyInfoHeading) continue
    let element = el
    while (element.nextSibling) {
      element = element.nextSibling
      if (element.nodeName !== '#comment') {
        studyInfo.push(element.innerText.trim())
      }
    }
  }
  return studyInfo;
}

formatDateTime = (date, time) => {
  //Date is displayed in the page as a single string in the following format: DD.MM.YYYY
  splitDate = date.split('.');
  return `${splitDate[2]}-${splitDate[1]}-${splitDate[0]}T${time}:00`;
}

parseEventObject = lectureInfoString => {
  const [weekday, date, time, ...location] = lectureInfoString.split(' ');
  const [startTime, endTime] = time.split('-').map(time => formatDateTime(date, time));
  return {
    summary: courseName,
    location: location.join(' '),
    start: {
      dateTime: startTime,
      timeZone: 'Europe/Helsinki',
    },
    end: {
      dateTime: endTime,
      timeZone: 'Europe/Helsinki',
    },
    reminders: {
      useDefault: false,
    },
  };
}

getLanguage = () => window.location.pathname.slice(1,3);

var translatedStrings = getLanguage() === 'en'
  ? {
    showMore: 'Show more',
    lectureTimes:'Teaching'
  }
  : {
    showMore: 'Näytä lisää',
    lectureTimes:'Opetusajat'
  };

expandStudyTimes(translatedStrings.showMore);

var courseName = findCourseName();
var studyInfo = findStudyInfo(translatedStrings.lectureTimes);
var eventObjects = studyInfo.map(parseEventObject);
chrome.runtime.sendMessage({ data: eventObjects });