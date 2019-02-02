expandStudyTimes = collapseLinkText => {
  const collapseLink = $(`a:contains(${collapseLinkText})`)[0];
  if (collapseLink) {
    collapseLink.click();
  }    
}

findStudyInfo = studyInfoHeading => {
  const studyInfo = $(`h6:contains(${studyInfoHeading})`)
    .siblings()
    .find("div:first-child")
    .text();
  return studyInfo;
}

formatDateTime = (date, time) => {
  //Date is displayed in the page as a single string in the following format: DD.MM.YYYY
  splitDate = date.split('.');
  return `${splitDate[2]}-${splitDate[1]}-${splitDate[0]}T${time}:00`;
}

parseEventObject = lectureInfoString => {
  const lectureInfo = lectureInfoString.trim().split(' ');
  const lectureHall = lectureInfo[3];
  const buildingName = lectureInfo[4]
  const location = `${lectureHall} ${buildingName}`;
  const [startTime, endTime] = lectureInfo[2].split('-').map(time => formatDateTime(lectureInfo[1], time));
  return {
    summary: 'Test',
    location,
    start: {
      dateTime: startTime,
      timeZone: 'Europe/Helsinki',
    },
    end: {
      dateTime: endTime,
      timeZone: 'Europe/Helsinki',
    }
  };
}

expandStudyTimes('Näytä lisää');
var studyInfo = findStudyInfo('Opetusajat');
var eventObjects = studyInfo.split('  ').map(parseEventObject);
console.log(eventObjects);

chrome.runtime.sendMessage({data: eventObjects});