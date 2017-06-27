  (function(){

    report('info', 'root', 'loaded, waiting for ready state');

    // Vars
    var waitTime = 0;
    var waitInterval = 10;
    var maxWaitTime = 5000;
    var snippetUrl = 'https://us-central1-simoti-171512.cloudfunctions.net/getSnippet';
    var logUrl = 'https://us-central1-simoti-171512.cloudfunctions.net/tagLogger';

    // Init wait loop
    var canStartInterval = setInterval(function() {
      waitTime += waitInterval;
      if (document.readyState === 'complete' || document.readyState === 'interactive') {
          clearInterval(canStartInterval);
          report('info', 'canStartInterval', 'starting after ['+waitTime+'ms] wait');
          init();
      } else if(waitTime >= maxWaitTime) {
        clearInterval(canStartInterval);
        report('warning', 'canStartInterval', 'max wait time reached, starting execution with state ['+document.readyState+']');
        init();
      }
    }, waitInterval);

    // Functions
    function report() {
      console.log('Simoti - report: ', arguments);
      postRequest('https://us-central1-simoti-171512.cloudfunctions.net/tagLogger', {}, function(err, result) {
        if(err) {
          console.log('Simoti: Unable to send log', err);
        }
      });
    }

    function init() {
      getRequest(snippetUrl, function(err, response){
        if(err) {
          report('error', 'init', 'error in getRequest', err);
        } else {
          report('info', 'init', 'got response from server', response);
          placeSnippet(response.container);
        }
      });
    }

    function getRequest(url, callback) {
      var xhr = new XMLHttpRequest();
      if (!('withCredentials' in xhr)) xhr = new XDomainRequest(); // fix IE8/9
      xhr.open('GET', url);
      xhr.onload = function(request) {
        try  {
          var response = JSON.parse(request.currentTarget.response || request.target.responseText);
          callback(null, response);
        } catch (e) {
          callback(e);
        }
      };
      xhr.onerror = function() {
        callback({error: 'unable to send get request'})
      };
      xhr.send();
      return xhr;
    }

    function postRequest(url, data, callback) {    
      var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
      xhr.open('POST', url, true);
      xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      xhr.setRequestHeader('Content-type', 'application/json');
      xhr.onload = function(request) {
        try  {
          var response = JSON.parse(request.currentTarget.response || request.target.responseText);
          callback(null, response);
        } catch (e) {
          callback(e);
        }
      };
      xhr.onerror = function() {
        callback({error: 'unable to send post request'})
      };
      /*xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {
            if(xhr.status === 200) {
              var json = JSON.parse(xhr.responseText);
              callback(null, json);
            } else {
              callback({
                statusCode: xhr.status,
                response: json
              });
            }
          }
      };*/
      xhr.send(JSON.stringify(data));
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

    function placeSnippetHTML(containerElement, contentBefore, contentAfter, position, snippetHTML) {
      var elementHTML = containerElement.innerHTML;
      var contentBeforeIndex = containerElement.innerHTML.indexOf(contentBefore);
      var contentAfterIndex = containerElement.innerHTML.indexOf(contentAfter);
      
      var regex = /<\s*br\s*\/?>/gi;
      var insertPosition = -1;
      while ((match = regex.exec(elementHTML)) != null && insertPosition === -1) {
        var brIndex = match.index;
        if(brIndex > contentBeforeIndex && brIndex < contentAfterIndex) { // found a <br> between the elements
          if(position === 'afterBeforeContent') {
            insertPosition  = brIndex;
          } else if(position === 'beforeAfterContent') {
            insertPosition = brIndex + match[0].length;
          }
        } else if(brIndex > contentAfterIndex) { // no <br> between paragraphs - insert AFTER next <br>
          insertPosition = brIndex + match[0].length;
        }
      }

      // Insert into calculated position
      if(insertPosition !== -1) {
        var articleBefore = containerElement.innerHTML.substring(0, insertPosition);
        var articleAfter = containerElement.innerHTML.substring(insertPosition);
        containerElement.innerHTML = articleBefore + snippetHTML + articleAfter;
      } else {
        report('error', 'placeSnippet', 'unable to find mathing location for snippet', arguments);
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
        placeSnippetHTML(containerElements.afterElement, snippet.contentBefore, snippet.contentAfter, snippet.position, snippet.html);
      } else { // Sperate elements (as should be) - add element between
        placeSnippetElement(containerElements.beforeElement, containerElements.afterElement, snippet.position, snippet.html);
      }

    }

  })();
