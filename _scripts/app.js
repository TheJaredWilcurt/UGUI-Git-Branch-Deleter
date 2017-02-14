
/////////////////////////// NOTE TO CONTRIBUTORS ////////////////////////////
//                                                                         //
// This is the main file with all code unique to UGUI: Git Branch Deleter. //
// It relies heavily on helper functions supplied by the UGUI framework.   //
//                                                                         //
// Anything that starts with "ugui.something" is explained on ugui.io/api. //
//                                                                         //
// To access Dev mode, change the body class to dev in index.htm and       //
// change toolbar to true in the package.json.                             //
//                                                                         //
/////////////////////////////////////////////////////////////////////////////






//Wait for the document to load before running ugui.js. Use either runUGUI or waitUGUI for immediate or delayed launch.
$(document).ready( runApp );





//Container for all UGUI components
function runApp() {



    // require('nw.gui').Window.get().showDevTools();



    function updateAllBranches(event) {
        if (event) {
            event.preventDefault();
        }

        $("#allBranches").empty();
        $("#branchToDelete").val("");

        ugui.helpers.buildUGUIArgObject();

        if (ugui.args.pathToRepo) {

            var executableAndArgs = 'git -C ' + ugui.args.pathToRepo.value + ' branch';

            ugui.helpers.runcmd(executableAndArgs, function(data) {
                var branches = data.split("\n");
                var isBranchCheckedOut = /^(?:\*\ )(?:[^\ ]*)$/gm;
                var gus = "";
                var jira = "";
                var github = "";
                var classes = '" class="external-link small col-xs-4 col-s-4 col-md-4 col-l-4"';

                for (var i = 0; i < (branches.length - 1); i++) {
                    var branch = branches[i].trim();
                    var checkedOutBranch = branches[i].trim();
                    var disableCheckoutOutBranch = '';

                    if (isBranchCheckedOut.test(branch)) {
                        branch = branch.split("* ")[1];
                        checkedOutBranch = '<strong>' + branch + '</strong> <em class="small">Active branch</em>';
                        disableCheckoutOutBranch = 'disabled="disabled" ';
                    }

                    if (ugui.args.gus && ugui.args.gus.value) {
                        //https://gus.my.salesforce.com/_ui/search/ui/UnifiedSearchResults?str=W-9999999
                        gus = '<a href="' + ugui.args.gus.value + '/_ui/search/ui/UnifiedSearchResults?str=' + branch + classes + '>GUS</a>';
                    }

                    if (ugui.args.jira && ugui.args.jira.value) {
                        //https://jira.company.com:1236/browse/Ticket-9999
                        jira = ' <a href="' + ugui.args.jira.value + '/browse/' + branch + classes + '>Jira</a>';
                    }

                    if (ugui.args.github && ugui.args.github.value) {
                        //https://github.company.com/Organization/Repo/Branch
                        github = ' <a href="' + ugui.args.github.value + '/branches/all?query=' + branch + classes + '>GitHub</a>';
                    }

                    $("#allBranches").append(
                        '<div class="col-xs-12 col-s-6 col-md-6 col-l-6">' +
                          '<label class="col-xs-8 col-s-8 col-md-8 col-l-8 branch-name">' +
                            '<input ' + disableCheckoutOutBranch + 'type="radio" name="radioBranches" value="' + branch + '" /> ' + checkedOutBranch +
                          '</label> ' +
                          '<span class="col-xs-4 col-s-4 col-md-4 col-l-4">' +
                            gus +
                            jira +
                            github +
                          '</span>' +
                        '</div>'
                    );
                }

                //After all the branches are on the page, trigger the function that opens Jira links in the default browser
                window.ugui.helpers.openDefaultBrowser();

                //Update Branch Count
                $("#branchcount").html('<em>(' + $("#allBranches input").length + ')</em>');

                $(".branch-name").change(function(){
                    for (var i = 0; i < $(".branch-name").length; i++) {
                        var currentRadioDial = $(".branch-name");
                        if ( $(currentRadioDial[i]).children().prop("checked") ) {
                            var pickedBranch = $(currentRadioDial[i]).children().val();
                            $("#branchToDelete").val(pickedBranch);
                            $(".delete-local").prop('disabled', false);
                        }
                    }
                    ugui.helpers.buildUGUIArgObject();
                });
            });
        }
        checkGUSStatus();
        checkJiraStatus();
        checkGitHubStatus();
    }

    //On page load, get the correct path to repo and then update the branches box
    ugui.helpers.loadSettings(updateAllBranches);

    $("#updateBranchList").click(updateAllBranches);

    $(".glyphicon-folder-open").click(function(){
        $("#browseDir").trigger("click");
    });

    $("#browseDir").change(function(){
        var newDir = $("#browseDir").val();
        newDir = newDir.split('\\').join('\/');
        $("#pathToRepo").val(newDir);
        updateAllBranches();
        ugui.helpers.saveSettings();
    });

    $(".delete-local").click(function(){
        var executableAndArgs = 'git -C ' + ugui.args.pathToRepo.value + ' branch -D ' + ugui.args.branchToDelete.value;
        ugui.helpers.runcmd(executableAndArgs);
        $(".delete-local").prop('disabled', true);
        setTimeout(updateAllBranches, 1000);
    });

    var windowHeight = 0;
    var branchContainerHeight = 0;

    $(window).resize(function(){
        windowHeight = $(window).height();
        branchContainerHeight = windowHeight - 325;
        $("#allBranches").css("height", branchContainerHeight + "px");
    });

    $('#gus').click( function(e) {
        e.preventDefault();
        $("#gusModal").fadeIn("slow");
        $("body").addClass("no-overflow");
    });

    $('#jira').click(function (evt) {
        evt.preventDefault();
        $("#jiraModal").fadeIn("slow");
        $("body").addClass("no-overflow");
    });

    $('#github').click(function (evt) {
        evt.preventDefault();
        $("#githubModal").fadeIn("slow");
        $("body").addClass("no-overflow");
    });

    $("#gusOK").click(function(evt) {
        evt.preventDefault();
        ugui.helpers.buildUGUIArgObject();
        $("#gusModal").slideUp("500", removeModal);
    });

    $("#jiraOK").click(function(evt) {
        evt.preventDefault();
        ugui.helpers.buildUGUIArgObject();
        $("#jiraModal").slideUp("500", removeModal);
    });

    $("#githubOK").click(function(evt) {
        evt.preventDefault();
        ugui.helpers.buildUGUIArgObject();
        $("#githubModal").slideUp("500", removeModal);
    });

    function removeModal() {
        $("body").removeClass("no-overflow");
        updateAllBranches();
        ugui.helpers.saveSettings();
    }

    function checkGUSStatus() {
        if (ugui.args.gus && ugui.args.gus.value) {
            $("#gus").removeClass("btn-default");
            $("#gus").addClass("btn-primary");
        } else {
            $("#gus").removeClass("btn-primary");
            $("#gus").addClass("btn-default");
        }
    }
    function checkJiraStatus() {
        if (ugui.args.jira && ugui.args.jira.value) {
            $("#jira").removeClass("btn-default");
            $("#jira").addClass("btn-primary");
        } else {
            $("#jira").removeClass("btn-primary");
            $("#jira").addClass("btn-default");
        }
    }
    function checkGitHubStatus() {
        if (ugui.args.github && ugui.args.github.value) {
            $("#github").removeClass("btn-default");
            $("#github").addClass("btn-primary");
        } else {
            $("#github").removeClass("btn-primary");
            $("#github").addClass("btn-default");
        }
    }

}// end runApp();
