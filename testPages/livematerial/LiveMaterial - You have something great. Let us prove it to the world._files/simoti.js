(function(){

  function getCORS(url, success) {
    var xhr = new XMLHttpRequest();
    if (!('withCredentials' in xhr)) xhr = new XDomainRequest(); // fix IE8/9
    xhr.open('GET', url);
    xhr.onload = success;
    xhr.send();
    return xhr;
  }

  // example request
  getCORS('http://app.simoti.co/api/snippet', function(request){
    var response = request.currentTarget.response || request.target.responseText;
    response = JSON.parse(response);
    var snippet = document.getElementById('simoti-snippet');

    // Title
    var titleElem = document.createElement('h3');
    var title = document.createTextNode(response.title);
    titleElem.appendChild(title);

    // Body
    var bodyElem = document.createElement('p');
    var body = document.createTextNode(response.body);
    bodyElem.appendChild(body);

    // Append
    snippet.appendChild(titleElem).appendChild(bodyElem);

  });

})();
