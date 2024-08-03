
document.addEventListener("DOMContentLoaded", function () {
    var CTtags = document.querySelectorAll("script");

    var CTscripts = Array.from(CTtags).filter(function (CTtags) {
        var CTsrc = CTtags.getAttribute("src");
        return CTsrc && CTsrc.endsWith(".citron");
    });

    CTscripts.forEach(function (CTscript) {
        console.log("Found .citron file:", CTscript.getAttribute("src"));

        CTreadFile(CTscript, function(error, content) {
            if (error) {
                console.error("Error reading file:", error);
            } else {
                console.log("File content:", content);
            }
        })

    });
});

function CTreadFile (filePath, callback) {
    fetch(filePath)
        .then(response => {
            if (!response.ok) {
                console.error("Netowkr response was not ok");

            }
            return response.text();
        })
        .then(text => {
            callback(null, text);
        })
        .catch(error => {
            callback(error, null);
        });

}

