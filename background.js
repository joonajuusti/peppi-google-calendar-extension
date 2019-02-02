chrome.runtime.onInstalled.addListener(function() {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {
          urlMatches: 'opas.peppi.utu.fi/fi/opintojakso/*|opas.peppi.utu.fi/en/course/*',
          schemes: ['https'],
        },
      })],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
});