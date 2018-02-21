var anchors; 
var paras;
var images;

var textToSave;

var file;
var contents;

function readHTML(evt) {
  //Retrieve the first (and only!) File from the FileList object
  file = evt.target.files[0];
  console.log(file);
  if (file) {
    var HTMLfile = new FileReader();
    HTMLfile.onload = function (e) {
      var parser = new DOMParser();
      contents = e.target.result;
      //contents = parser.parseFromString(contents, "text/html");
      document.getElementById("ReadResult").innerHTML = contents;
    }
    HTMLfile.readAsText(file);
  } else {
    alert("Failed to load file");
  }
}

// function populateIframe() {
//   var emailView = document.getElementById("emailView");
  
// }

function extractTags() {
  if (file == undefined) {
    alert("Choose a file before");
  } else {
    var contentHTML = document.getElementById("ReadResult");
    anchors = contentHTML.getElementsByTagName('a');
    paras = contentHTML.getElementsByTagName('p');
    images = contentHTML.getElementsByTagName('img');
    showTagContents();
    document.getElementById("resultsWindow").style.display = "block";
  }

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

  var modHrefsValues = [];
  var modSrcsValues = [];
  var modAltsValues = [];
  var modTitlesValues = [];


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

  for (var j = 0; j < images.length; j++) {
    images[j].src = modSrcsValues[j];
  }

  for (var k = 0; k < images.length; k++) {
    images[k].alt = modAltsValues[k];
  }

  for (var h = 0; h < images.length; h++) {
    images[h].title = modTitlesValues[h];
  }

}

function escapeHtml(unsafe) {
  return unsafe
    .replace(/À/g, "&Agrave;")
    .replace(/à/g, "&agrave;")
    .replace(/Â/g, "&Acirc;")
    .replace(/â/g, "&acirc;")
    .replace(/Æ/g, "&AElig;")
    .replace(/æ/g, "&aelig;")
    .replace(/Ç/g, "&Ccedil;")
    .replace(/ç/g, "&ccedil;")
    .replace(/È/g, "&Egrave;")
    .replace(/è/g, "&egrave;")
    .replace(/É/g, "&Eacute;")
    .replace(/é/g, "&eacute;")
    .replace(/Ê/g, "&Ecirc;")
    .replace(/ê/g, "&ecirc;")
    .replace(/Ë/g, "&Euml;")
    .replace(/ë/g, "&euml;")
    .replace(/Î/g, "&Icirc;")
    .replace(/î/g, "&icirc;")
    .replace(/Ï/g, "&Iuml;")
    .replace(/ï/g, "&iuml;")
    .replace(/Ô/g, "&Ocirc;")
    .replace(/ô/g, "&ocirc;")
    .replace(/Œ/g, "&OElig;")
    .replace(/œ/g, "&oelig;")
    .replace(/Ù/g, "&Ugrave;")
    .replace(/ù/g, "&ugrave;")
    .replace(/Û/g, "&Ucirc;")
    .replace(/û/g, "&ucirc;")
    .replace(/Ü/g, "&Uuml;")
    .replace(/ü/g, "&uuml;")

    .replace(/«/g, "&laquo;")
    .replace(/»/g, "&raquo;")
    .replace(/’/g, "&rsquo;")
    .replace(/®/g, "&reg;")
    .replace(/•/g, "&bull;")
    .replace(/Ω/g, "&Omega;")
    .replace(/†/g, "&dagger;")
    .replace(/‡/g, "&ddagger;")
    .replace(/©/g, "&copy;")
    
    .replace(/<tbody>/g, " ")
    .replace(/<\/tbody>/g, " ");
  }

function saveAsFile() {
  if (file == undefined) {
    alert("Choose a file before");
  } else {
    textToSave = document.getElementById("ReadResult").innerHTML;
    textToSave = escapeHtml(textToSave);
    // var textToSave = contents;
    var textToSaveAsBlob = new Blob([textToSave], {encoding:"UTF-8", type:"text/html;charset=UTF-8"});
    var textToSaveAsURL = window.URL.createObjectURL(textToSaveAsBlob);
  
    var downloadLink = document.createElement("a");
    downloadLink.download = file.name;
    downloadLink.innerHTML = "Download File";
    downloadLink.href = textToSaveAsURL;
    downloadLink.onclick = destroyClickedElement;
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
  
    downloadLink.click();
  }

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
