function onOpen() {
  var ui = SpreadsheetApp.getUi();
  var menu = ui.createMenu("Scouting");
  menu.addItem("Create Team Sheets", "createTeams");
  menu.addItem("Delete Team Sheets", "deleteTeams");
  menu.addToUi();
}

function createTeams() {
  var settings = parseSettings();
  
  var teams;
  
  if(typeof(settings.eventKey) === "string" && settings.eventKey !== '' && typeof(settings.tbaKey) === "string" && settings.tbaKey !== '') {
    try {
      teams = fetchTeams(settings);
    }
    catch(err) {
      var response = ui.alert("Error", "Invalid settings. Continue using current teamsList?", ui.ButtonSet.OK_CANCEL)
      if(!response.OK) {
        return;
      }
      teams = loadTeams();
    }
  }
  else {
    teams = loadTeams();
  }
  
  var thisSpreadSheet = SpreadsheetApp.getActiveSpreadsheet();
  var template = thisSpreadSheet.getSheetByName("template");
  var templateData = template.getDataRange();
  
  var locations = {};
  
  var keys = Object.keys(teams[0]);
  for(var i = 0; i < keys.length; i++)
  {
    locations[keys[i]] = [];
  }
  
  for(var i = 1; i <= templateData.getNumRows(); i++)
  {
    for(var j = 1; j <= templateData.getNumColumns(); j++)
    {
      var cell = templateData.getCell(i, j).getValue();
      for(var k = 0; k < keys.length; k++)
      {
        if(cell == '<' + keys[k] + '>')
        {
          locations[keys[k]].push([i, j]);
        }
      }
    }
  }
  
  deleteTeams();

  for(var i = 0; i < teams.length; i++)
  {
    thisSpreadSheet.insertSheet(teams[i]["key"].toString(), thisSpreadSheet.getNumSheets(), {template: template});
    
    for(var k = 0; k < keys.length; k++)
    {
      for(var j = 0; j < locations[keys[k]].length; j++)
      {
        thisSpreadSheet.getSheetByName(teams[i]["key"]).getRange(locations[keys[k]][j][0], locations[keys[k]][j][1]).setValue(teams[i][keys[k]]);
      }
    }
  }
}

function deleteTeams() {
  var thisSpreadSheet = SpreadsheetApp.getActiveSpreadsheet();
  for(var i = 0; i < thisSpreadSheet.getNumSheets(); i++)
  {
    if(thisSpreadSheet.getSheets()[i].getName().substr(0, 3) === 'frc')
    {
      thisSpreadSheet.deleteSheet(thisSpreadSheet.getSheets()[i]);
      i--;
    }
  }
}
  
function fetchTeams(settings) {
  var teamsResponse;
  teamsResponse = UrlFetchApp.fetch("https://thebluealliance.com/api/v3/event/" + settings.eventKey + "/teams?X-TBA-Auth-Key=" + settings.tbaKey);
  return JSON.parse(teamsResponse.getContentText()).sort(function (a, b) { return parseInt(a['team_number']) - parseInt(b['team_number'])});
}

function loadTeams() {
  var thisSpreadSheet = SpreadsheetApp.getActiveSpreadsheet();
  var teamsList = thisSpreadSheet.getSheetByName("teamsList").getDataRange().getValues();
  var teams = [];
  for(var i = 0; i < teamsList.length; i++) {
    var team = teamsList[i][0];
    if(typeof(team) === "number" && team !== 0) {
      teams.push({"team_number": team, "key": "frc" + team});
    }
  }
  return teams;
}

function parseSettings() {
  var thisSpreadSheet = SpreadsheetApp.getActiveSpreadsheet();
  var settings = thisSpreadSheet.getSheetByName("settings").getDataRange().getValues();
  return {
    "eventKey": settings[0][0],
    "tbaKey": settings[1][0]
  };
}

function showError(txt) {
  var ui = SpreadsheetApp.getUi();
  return ui.alert("Error", txt, ui.ButtonSet.OK);
}
