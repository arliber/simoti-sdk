(function(){

  console.log('Simoti: Started');

  function getRequest(url, success) {
    var xhr = new XMLHttpRequest();
    if (!('withCredentials' in xhr)) xhr = new XDomainRequest(); // fix IE8/9
    xhr.open('GET', url);
    xhr.onload = success;
    xhr.send();
    return xhr;
  }

  function findContainerElements(beforeText, afterText) {
    var elements = document.getElementsByTagName("*");
    var beforeContainers = [];
    var afterContainers = [];

    //Build container trees
    for (var i = 0; i < elements.length; i++) {
      if (elements[i].textContent.indexOf(beforeText) !== -1) {
        beforeContainers.push(elements[i]);
      } else if(elements[i].textContent.indexOf(afterText) !== -1) {
        afterContainers.push(elements[i]);
      }
    }

    //Find container elements
    var beforeElement = beforeContainers[beforeContainers.length - 1];
    var afterElement = afterContainers[afterContainers.length - 1];
    for(i = beforeContainers.length - 1, j = afterContainers.length - 1; i >= 0 && j >= 0; i--, j--) {
      if(beforeContainers[i] === afterContainers[j]) {
        beforeElement = beforeContainers[i+1];
        afterElement = afterContainers[i+1];
      }
    }

    return {
      beforeElement: beforeElement,
      afterElement: afterElement
    };

  }

  function placeSnippet(snippet) {
    var containerElements = findContainerElements(snippet.contentBefore, snippet.contentAfter);
    var parser = new DOMParser()
    var snippetElement = parser.parseFromString(snippet.html, 'text/xml');

    if(snippet.position === 'afterBeforeContent') {
      containerElements.beforeElement.parentNode.insertBefore(snippetElement.documentElement, containerElements.beforeElement.nextSibling);
    } else if(snippet.position === 'beforeAfterContent') {
      containerElements.afterElement.parentNode.insertBefore(snippetElement.documentElement, containerElements.afterElement);
    }
  }

  getRequest('https://us-central1-simoti-171512.cloudfunctions.net/getSnippet', function(request){
    var response = JSON.parse(request.currentTarget.response || request.target.responseText);
    console.log('Simoti - placeSnippet: Got response', response);
    placeSnippet(response.container);
  });

})();
