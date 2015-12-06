$(document).ready(function(){
    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    $.get("https://api.github.com/repos/TheJaredWilcurt/UGUI-Git-Branch-Deleter/releases", function(data){
        $("#loader").remove();
        var totalDownloads = [];
        var win = [];
        var unix = [];
        for (var i = 0; i < data.length; i++) {
            var version = data[i].tag_name;
            var versionNumber = version.split('v')[1];
            var dateTime = data[i].created_at;
            var date = dateTime.split('T')[0];
            var release = '<a href="https://github.com/TheJaredWilcurt/UGUI-Git-Branch-Deleter/releases/tag/' + version + '" title="View release notes">' + date + '</a>';
            var downloadURL = "#";
            var downloads = "N/A";
            var sizeMB = "N/A";
            var downloadAndVersion = 'UGUI: FLIF ' + version;
            if (data[i].assets[0]) {
                for (var j = 0; j < data[i].assets.length; j++) {
                    downloadURL = data[i].assets[j].browser_download_url;
                    downloads = data[i].assets[j].download_count;
                    var Bytes = data[i].assets[j].size;
                    var KB = Bytes / 1024;
                    var MB = KB / 1024;
                    sizeMB = '<span title="' + numberWithCommas(Math.round(KB)) + ' KB">' + (Math.round(MB * 10) / 10) + ' MB</span>';
                    var name = data[i].assets[j].name;
                    download = '<a href="' + downloadURL + '" title="Download this version">' + name + '</a>';
                    totalDownloads.push(downloads);
                    //If file is bigger than 20MB
                    name = name.toLowerCase();
                    if ( name.indexOf("win") !== -1 ) {
                        win.push(downloads);
                    } else {
                        unix.push(downloads);
                    }
                    //Make the line between releases thicker
                    var tr = "<tr>";
                    if (j == 0 && i == 0) {
                        tr = '<tr class="latest-release">';
                    } else if (j == 0) {
                        tr = '<tr class="new-release">';
                    }
                    $("#output tbody").append(
                        tr +
                          '<td><strong>' + version + '</strong></td>' +
                          '<td>' + download + '</td>' +
                          '<td>' + sizeMB + '</td>' +
                          '<td>' + release + '</td>' +
                          '<td>' + downloads + '</td>' +
                        '</tr>'
                    );
                }
            } else {
                $("#output tbody").append(
                    '<tr>' +
                      '<td><strong>' + version + '</strong></td>' +
                      '<td>' + download + '</td>' +
                      '<td>' + sizeMB + '</td>' +
                      '<td>' + release + '</td>' +
                      '<td>' + downloads + '</td>' +
                    '</tr>'
                );
            }
        }
        var downloadCount = 0;
        var downloadCountWIN = 0;
        var downloadCountUNIX = 0;
        for (var k = 0; k < totalDownloads.length; k++) {
            downloadCount = downloadCount + totalDownloads[k];
        }
        for (var l = 0; l < win.length; l++) {
            downloadCountWIN = downloadCountWIN + win[l];
        }
        for (var m = 0; m < unix.length; m++) {
            downloadCountUNIX = downloadCountUNIX + unix[m];
        }
        $("#total").html('<p>The official releases of UGUI: FLIF have been downloaded <strong>' + downloadCount + ' times</strong>.</p>');
        var withoutCLI = downloadCountWIN + downloadCountUNIX;
        $("#os .win").width( Math.round( (downloadCountWIN / withoutCLI) * 100) + "%" ).attr("title", downloadCountWIN + " downloads");
        $("#os .unix").width( Math.round( (downloadCountUNIX / withoutCLI) * 100) + "%" ).attr("title", downloadCountUNIX + " downloads");
        $("#os").css("visibility", "visible");

        var latestVersion = data[0].tag_name.split('v')[1];
        $(".dl-btn-win a").attr("href", "https://github.com/TheJaredWilcurt/UGUI-Git-Branch-Deleter/releases/download/v" + latestVersion + "/UGUI-Git-Branch-Deleter_" + latestVersion + "-win.zip");
        $(".dl-btn-unix a").attr("href", "https://github.com/TheJaredWilcurt/UGUI-Git-Branch-Deleter/releases/download/v" + latestVersion + "/UGUI-Git-Branch-Deleter_" + latestVersion + "-unix.zip");

    });
});
