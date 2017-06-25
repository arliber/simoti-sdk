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
    var elements = document.getElementsByTagName('*');
    var beforeContainers = [];
    var afterContainers = [];

    //Build container trees
    for (var i = 0; i < elements.length; i++) {
      if (elements[i].textContent.indexOf(beforeText) !== -1) {
        beforeContainers.push(elements[i]);
      }
      if(elements[i].textContent.indexOf(afterText) !== -1) {
        afterContainers.push(elements[i]);
      }
    }

    //Find container elements
    var beforeElement = beforeContainers[beforeContainers.length - 1];
    var afterElement = afterContainers[afterContainers.length - 1];

    if(beforeElement !== afterElement) { // Elements are in different containers
      for(i = beforeContainers.length - 1, j = afterContainers.length - 1; i >= 0 && j >= 0; i--, j--) {
        if(beforeContainers[i] === afterContainers[j]) {
          beforeElement = beforeContainers[i+1];
          afterElement = afterContainers[i+1];
          break;
        }
      }
    }

    return {
      beforeElement: beforeElement,
      afterElement: afterElement
    };

  }

  function placeSnippetHTML(containerElement, contentAfter, snippetHTML) {
    var contentAfterIndex = containerElement.innerHTML.indexOf(contentAfter);
    if(contentAfterIndex > -1) {
      var articleBefore = containerElement.innerHTML.substring(0, contentAfterIndex);
      var articleAfter = containerElement.innerHTML.substring(contentAfterIndex);
      containerElement.innerHTML = articleBefore + snippetHTML + articleAfter;
    }
  }

  function placeSnippetElement(beforeElement, afterElement, position, snippetHTML) {
    var parser = new DOMParser()
    var snippetElement = parser.parseFromString(snippetHTML, 'text/xml');

    if(position === 'afterBeforeContent') {
      beforeElement.parentNode.insertBefore(snippetElement.documentElement, beforeElement.nextSibling);
    } else if(position === 'beforeAfterContent') {
      afterElement.parentNode.insertBefore(snippetElement.documentElement, afterElement);
    }
  }

  function placeSnippet(snippet) {
    var containerElements = findContainerElements(snippet.contentBefore, snippet.contentAfter);

    if(containerElements.beforeElement === containerElements.afterElement) { // Same parent - insert with between text
      placeSnippetHTML(containerElements.afterElement, snippet.contentAfter, snippet.html)
    } else { // Sperate elements (as should be) - add element between
      placeSnippetElement(containerElements.beforeElement, containerElements.afterElement, snippet.position, snippet.html)
    }

  }

  getRequest('https://us-central1-simoti-171512.cloudfunctions.net/getSnippet', function(request){
    var response = JSON.parse(request.currentTarget.response || request.target.responseText);
    console.log('Simoti - placeSnippet: Got response', response);
    placeSnippet(response.container);
  });

})();
