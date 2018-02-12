var anchors; 
var paras;
var images;

var modHrefsValues = [];
var modSrcsValues = [];
var modAltsValues = [];
var modTitlesValues = [];

function readHTML(evt) {
  //Retrieve the first (and only!) File from the FileList object
  var f = evt.target.files[0];
  var contents;
  console.log(f);
  if (f) {
    var HTMLfile = new FileReader();
    HTMLfile.onload = function (e) {
      contents = e.target.result;
      document.getElementById("ReadResult").innerHTML = contents;
    }
    HTMLfile.readAsText(f);
  } else {
    alert("Failed to load file");
  }
}

// function populateIframe() {
//   var emailView = document.getElementById("emailView");
  
// }

function extractTags() {
  var contentHTML = document.getElementById("ReadResult");
  anchors = contentHTML.getElementsByTagName('a');
  paras = contentHTML.getElementsByTagName('p');
  images = contentHTML.getElementsByTagName('img');
  showTagContents();
}

function showTagContents() {
  var listsPara = document.getElementById("lists-para");
  var listsAchor = document.getElementById("lists-anchors");
  var listImages = document.getElementById("lists-images");

  for (var i = 0; i < paras.length; i++) {
    listsPara.innerHTML += "<li>" + paras[i].innerHTML + "</li>";
  }

  for (var i = 0; i < anchors.length; i++) {
    listsAchor.innerHTML += "<div class='element'><li class='nopoint'>" + anchors[i].innerHTML + "</li>" 
    + "<ul><li class='hrefsgrid nopoint'><strong>HREF:</strong> <input class='editables href-input' type='text' value='" + anchors[i].href + "'></li></div>";
  }

  for (var i = 0; i < images.length; i++) {
    listImages.innerHTML += "<div class='element'><li class='nopoint'>" + images[i].outerHTML + "</li>" 
    + "<ul><li class='hrefsgrid nopoint'><strong>SRC:</strong> <input class='editables src-input' type='text' value='" + images[i].src + "'></li>" 
    + "<li class='hrefsgrid nopoint'><strong>ALT:</strong> <input class='editables alt-input' type='text' value='" + images[i].alt + "'></li>"
    + "<li class='hrefsgrid nopoint'><strong>Title:</strong> <input class='editables title-input' type='text' value='" + images[i].title + "'></li></ul></div>";
  }
}

function modifyEmail () {

  function getNewValues () {
    // This functions get the value of the input forms showing at the right column. It stores them in an array, the global variables named modXXXXValues.
    var editedHrefs = document.getElementsByClassName("href-input");
    var editedSrcs = document.getElementsByClassName("src-input");
    var editedAlts = document.getElementsByClassName("alt-input");
    var editedTitles = document.getElementsByClassName("title-input"); 
    
    for (var i = 0; i < editedHrefs.length; i++) {
      modHrefsValues.push(editedHrefs[i].value);
    }
  
    for (var j = 0; j < editedSrcs.length; j++) {
      modSrcsValues.push(editedSrcs[j].value);
    }
  
    for (var k = 0; k < editedAlts.length; k++) {
      modAltsValues.push(editedAlts[k].value);
    }
  
    for (var h = 0; h < editedTitles.length; h++) {
      modTitlesValues.push(editedTitles[h].value);
    }
  }

  getNewValues();

  for (var i = 0; i < anchors.length; i++) {
    anchors[i].href = modHrefsValues[i];
  }

  for (var j = 0; j < anchors.length; j++) {
    images[j].src = modSrcsValues[j];
  }

  for (var k = 0; k < anchors.length; k++) {
    anchors[k].alt = modAltsValues[k];
  }

  for (var h = 0; h < anchors.length; h++) {
    anchors[h].title = modTitlesValues[h];
  }
}

function saveAsFile() {
  var textToSave = document.getElementById("ReadResult").innerHTML;
  var textToSaveAsBlob = new Blob([textToSave], {type: "text/html"});
  var textToSaveAsURL = window.URL.createObjectURL(textToSaveAsBlob);
  var fileNameToSaveAs = document.getElementById("inputFileNameToSaveAs").value;

  var downloadLink = document.createElement("a");
  downloadLink.download = fileNameToSaveAs;
  downloadLink.innerHTML = "Download File";
  downloadLink.href = textToSaveAsURL;
  downloadLink.onclick = destroyClickedElement;
  downloadLink.style.display = "none";
  document.body.appendChild(downloadLink);

  downloadLink.click();
}

function destroyClickedElement(event) {
  document.body.removeChild(event.target);
}

function main() {
  document.getElementById('fileinput').addEventListener('change', readHTML, false);
  document.getElementById('run').addEventListener('click', extractTags, false);
  document.getElementById('saveButton').addEventListener('click', saveAsFile, false);
  document.getElementById('applyChanges').addEventListener('click', modifyEmail, false);
  
  
  // event listener for accordion elements
  var acc = document.getElementsByClassName("accordion");
  for (var z = 0; z < acc.length; z++) {
    acc[z].addEventListener("click", function () {
      this.classList.toggle("active");
      var panel = this.nextElementSibling;
      if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
      } else {
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  }
}
  
main();
