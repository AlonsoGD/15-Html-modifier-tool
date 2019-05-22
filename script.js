document.addEventListener("DOMContentLoaded", function(event) {
  var anchors;
  var images;
  var linksList = [];
  var linksListPlain = [];

  var originalFile;
  var originalCode;

  function readHTML(evt) {
    //Retrieve the first (and only!) originalFile from the FileList object
    originalFile = evt.target.files[0];
    if (originalFile) {
      var HTMLfile = new FileReader();

      HTMLfile.onload = function(e) {
        var parser = new DOMParser();
        originalCode = e.target.result;

        if (searchFirstLines(originalCode) === false) {
          alert(
            "File should have <!DOCTYPE> declaration at the begining of the code"
          );
          return;
        }

        document.getElementById("ReadResult").innerHTML = originalCode;

        document
          .getElementById("fileinput")
          .classList.remove("action-btn--active");
        document
          .getElementById("populateButton")
          .classList.add("action-btn--active");
      };
      HTMLfile.readAsText(originalFile);
    } else {
      alert("Failed to load a file");
    }
  }

  function searchFirstLines(string) {
    var documentFirstLines = string.match(/<!DOCTYPE[^>]*>[\s\S]+?<table/i);
    if (documentFirstLines === null) {
      return false;
    }
    return documentFirstLines[0];
  }

  function replaceFirstLines(string) {
    //Search from the beggining of code imported in the tool until the first <table. Replaces that with the original code from the file (that contains the tags removed. Doctype, HMTM, Head, body)
    var documentFirstLines = string.replace(
      /^[\s\S]+?<table/i,
      searchFirstLines(originalCode)
    );
    return documentFirstLines;
  }

  function extractTags() {
    function clearResults() {
      //var listsPara = document.getElementById("lists-para");
      var listsAchor = document.getElementById("lists-anchors");
      var listImages = document.getElementById("lists-images");

      //listsPara.innerHTML = "";
      listsAchor.innerHTML = "";
      listImages.innerHTML = "";
      linksList = [];
      linksListPlain = [];
      //resets 'copy links to clipboard' button
      document.getElementById("printLinksButton").disabled = false;
    }

    if (originalFile == undefined) {
      alert("Choose a file before");
    } else {
      document.getElementById("populateButton").innerText = "Refresh";

      clearResults();

      var contentHTML = document.getElementById("ReadResult");
      anchors = contentHTML.getElementsByTagName("a");
      //paras = contentHTML.getElementsByTagName('p');
      images = contentHTML.getElementsByTagName("img");
      showTagContents();
      document.getElementById("resultsWindow").style.display = "block";
    }
  }

  function showTagContents() {
    //var listsPara = document.getElementById("lists-para");
    var listsAchor = document.getElementById("lists-anchors");
    var listImages = document.getElementById("lists-images");
    //for (var i = 0; i < paras.length; i++) {
    //  listsPara.innerHTML += "<li>" + paras[i].innerHTML + "</li>";
    //}

    for (var i = 0; i < anchors.length; i++) {
      listsAchor.innerHTML +=
        "<div class='element'><li class='nopoint'>" +
        anchors[i].innerHTML +
        "</li>" +
        "<ul><li class='hrefsgrid nopoint'><div class='attribute'><strong>HREF:</strong></div> <input class='editables href-input' type='text' value='" +
        anchors[i].href +
        "'></li></div>";
    }
    for (var i = 0; i < images.length; i++) {
      listImages.innerHTML +=
        "<div class='element'><li class='nopoint'>" +
        images[i].outerHTML +
        "</li>" +
        "<ul><li class='hrefsgrid nopoint'><div class='attribute'><strong>SRC:</strong></div> <input class='editables src-input' type='text' value='" +
        images[i].src +
        "'></li>" +
        "<li class='hrefsgrid nopoint'><div class='attribute'><strong>ALT:</strong></div> <input class='editables alt-input' type='text' value='" +
        images[i].alt +
        "'></li>" +
        "<li class='hrefsgrid nopoint'><div class='attribute'><strong>Title:</strong></div> <input class='editables title-input' type='text' value='" +
        images[i].title +
        "'></li></ul></div>";
    }
  }

  function modifyEmail() {
    if (originalFile == undefined) {
      alert("Choose a file before");
    } else {
      var modHrefsValues = [];
      var modSrcsValues = [];
      var modAltsValues = [];
      var modTitlesValues = [];

      function getNewValues() {
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
      linksList = modHrefsValues;

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
      .replace(/‡/g, "&Dagger;")
      .replace(/©/g, "&copy;")
      .replace(/Ç/g, "&Ccedil;")

      .replace(/&amp;/g, "&")
      .replace(/<br>/g, "<br />")

      .replace(/<tbody>/g, "")
      .replace(/<\/tbody>/g, "");
  }

  function saveAsHtmlFile() {
    function rebuildOriginalFile() {
      var textToSave = document.getElementById("ReadResult").innerHTML;
      textToSave =
        replaceFirstLines(escapeHtml(textToSave)) +
        "</body>" +
        "\n" +
        "</html>";

      return textToSave;
    }

    if (originalFile == undefined) {
      alert("Choose a file before");
    } else {
      var textToSaveAsBlob = new Blob([rebuildOriginalFile()], {
        encoding: "UTF-8",
        type: "text/html;charset=UTF-8"
      });
      var textToSaveAsURL = window.URL.createObjectURL(textToSaveAsBlob);

      var downloadLink = document.createElement("a");
      downloadLink.download = originalFile.name;
      downloadLink.innerHTML = "Download originalFile";
      downloadLink.href = textToSaveAsURL;
      downloadLink.onclick = destroyClickedElement;
      downloadLink.style.display = "none";
      document.body.appendChild(downloadLink);

      downloadLink.click();
    }
  }

  //Converts an array into a string with a line break for every item in the array.
  function formatArrayForCsv(arr) {
    var csvContent = "";
    csvContent = arr.join("");
    return csvContent;
  }

  function copyLinksToClippboard() {
    saveLinksinArrayJustLinks();

    let clipboardData = formatArrayForCsv(linksListPlain);

    navigator.clipboard.writeText(clipboardData).then(
      function() {
        //switch to enable and disable button once pressed
        document.getElementById("printLinksButton").disabled = true;
        /* clipboard successfully set */
      },
      function() {
        /* clipboard write failed */
      }
    );
  }

  function saveLinksinArrayJustLinks() {
    try {
      let anchorsArray = Array.from(anchors);
      anchorsArray.map(function(item, index, array) {
        if (index != array.length - 1) {
          linksListPlain.push(item.href + "\n");
        } else {
          linksListPlain.push(item.href);
        }
      });
    } catch (e) {
      console.log(`${e.name}: ${e.message}`);
      alert(`Please press the "Populate" button first!`);
    }
  }

  function randomGenerator() {
    return (
      Math.random()
        .toString(36)
        .substring(2, 5) +
      Math.random()
        .toString(36)
        .substring(2, 5)
    );
  }

  function saveLinksinArray() {
    try {
      var jrfNumber = document.getElementById("jrfBox").value;

      for (var i = 0; i < anchors.length; i++) {
        linksList.push(anchors[i].href);
        linksList.push("," + jrfNumber + "_" + randomGenerator() + ",");
        linksList.push("link_" + [i + 1] + "\n");
      }
    } catch (e) {
      alert("Please press populate button");
    }
  }

  function saveLinksAsCSV() {
    if (originalFile == undefined) {
      alert("Choose a file before");
    } else {
      saveLinksinArray();
      var textToSaveAsBlob = new Blob([formatArrayForCsv(linksList)], {
        type: "text/csv;charset=utf-8;"
      });
      var textToSaveAsURL = window.URL.createObjectURL(textToSaveAsBlob);

      var downloadLink = document.createElement("a");
      downloadLink.download = originalFile.name.replace(/.html/gi, ".csv");
      downloadLink.innerHTML = "Download HTML_links";
      downloadLink.href = textToSaveAsURL;
      downloadLink.onclick = destroyClickedElement;
      downloadLink.style.display = "none";
      document.body.appendChild(downloadLink);

      downloadLink.click();
      linksList = [];
    }
  }

  function destroyClickedElement(event) {
    document.body.removeChild(event.target);
  }

  function useLinksProvided() {
    function parseCvs(string) {
      // Get links added by user
      var parsedString = string.split(/,| |\n/);
      return parsedString;
    }

    if (originalFile === undefined) {
      alert("Choose a file before");
    } else if (document.getElementById("linksEntry").value === "") {
      alert("Fill the box with your links");
    } else {
      var hrefBoxes = document.getElementsByClassName("href-input");
      var newLinksArray = parseCvs(document.getElementById("linksEntry").value);

      for (var i = 0; i < newLinksArray.length; i++) {
        hrefBoxes[i].value = newLinksArray[i];
      }
    }
  }

  function openModalCsv() {
    var downloadCSVButton = document.getElementById("downloadCSVButton");
    var cancelButtonCSVDialog = document.getElementById("cancelCSVDialog");
    var csvDialog = document.getElementById("favDialog");

    csvDialog.showModal();
    // Update button opens a modal csvDialog
    downloadCSVButton.addEventListener("click", function() {
      saveLinksAsCSV();
    });

    // Form cancel button closes the csvDialog box
    cancelButtonCSVDialog.addEventListener("click", function() {
      csvDialog.close("NotUsed");
    });
  }

  function openModalChageLinks() {
    var changeLinksButton = document.getElementById("changeLinksButton");
    var cancelLinksDialog = document.getElementById("cancelLinksDialog");
    var linksDialog = document.getElementById("linksDialog");

    linksDialog.showModal();
    // Update button opens a modal linksDialog
    changeLinksButton.addEventListener("click", function() {});

    // Form cancel button closes the linksDialog box
    cancelLinksDialog.addEventListener("click", function() {
      linksDialog.close("NotUsed");
    });
  }

  function main() {
    document
      .getElementById("fileinput")
      .addEventListener("change", readHTML, false);
    document
      .getElementById("populateButton")
      .addEventListener("click", extractTags, false);
    document
      .getElementById("applyChangesButton")
      .addEventListener("click", modifyEmail, false);
    document
      .getElementById("saveButton")
      .addEventListener("click", saveAsHtmlFile, false);
    document
      .getElementById("saveLinksButton")
      .addEventListener("click", openModalCsv, false);
    document
      .getElementById("readLinksButton")
      .addEventListener("click", useLinksProvided, false);
    document
      .getElementById("printLinksButton")
      .addEventListener("click", copyLinksToClippboard, false);
    document
      .getElementById("changeLinksButton")
      .addEventListener("click", openModalChageLinks, false);

    // event listener for accordion elements
    var acc = document.getElementsByClassName("accordion");
    function changeActiveButton() {
      let element1 = document.getElementById("populateButton");
      let element2 = document.getElementById("applyChangesButton");
      element1.classList.remove("action-btn--active");
      element2.classList.add("action-btn--active");
    }

    for (var z = 0; z < acc.length; z++) {
      acc[z].addEventListener("click", function() {
        this.classList.toggle("active");
        changeActiveButton();
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
});
