var settingsSheetName = 'Settings';

var settingsKeys = {
  "eventKey": 'event',
  "apiKey": 'tbakey',
  "dataKey": 'data',
  "templateKey": 'template'
}

var menuItems = {
  "Create Teams": 'createAll',
  "Delete Teams": 'deleteAll',
  "Create Settings": 'createSettings'
}

function onOpen()
{
  var ui = SpreadsheetApp.getUi();
  var menu = ui.createMenu("Scouting");
  var menus = Object.keys(menuItems);
  
  for(var i = 0; i < menus.length; i++)
  {
    menu.addItem(menus[i], menuItems[menus[i]]);
  }
  menu.addToUi();
}

function createAll()
{
  var template = parseSetting(settingsKeys["templateKey"]);
  var tbaKey = parseSetting(settingsKeys["apiKey"]);
  var event = parseSetting(settingsKeys["eventKey"]);
  
  if(typeof(template) !== "string" || template == '' || typeof(tbaKey) !== "string" || tbaKey == '' || typeof(event) !== "string" || event == '')
  {
    showError("Settings are invalid");
    return;
  }
  
  var teamsResponse;
  try
  {
    teamsResponse = UrlFetchApp.fetch("https://thebluealliance.com/api/v3/event/" + event + "/teams/keys?X-TBA-Auth-Key=" + tbaKey);
  } catch(err)
  {
    showError("Event key or TBA key is invalid");
    return;
  }
  
  deleteAll();
  
  var thisSpreadSheet = SpreadsheetApp.getActiveSpreadsheet();
  var templateSheet = thisSpreadSheet.getSheetByName(template);
  
  var teams = JSON.parse(teamsResponse.getContentText());
  
  for(var i = 0; i < teams.length; i++)
  {
    thisSpreadSheet.insertSheet(teams[i].toString(), thisSpreadSheet.getNumSheets(), {template: templateSheet});       //creates a new sheet with the team numbers in the "TeamNumbers" sheet, as the last sheet, based on the sheet "Template"
    thisSpreadSheet.getRange("A1").setValue(teams[i].substr(3));         // Fills team number cell
  }
}

function deleteAll()
{
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

function createSettings()
{
  var thisSpreadSheet = SpreadsheetApp.getActiveSpreadsheet();
  var settingsSheet = thisSpreadSheet.getSheetByName(settingsSheetName);
  
  if(settingsSheet != null)
  {
    var ui = SpreadsheetApp.getUi();
    var response = ui.alert("Overwrite settings keys column?", "The keys column of the settings sheet will be overwritten. Values will remain, but may be in the wrong row.", ui.ButtonSet.OK_CANCEL);
    if(!response.OK)
    {
      return;
    }
  } else
  {
    settingsSheet = thisSpreadSheet.insertSheet(settingsSheetName);
  }
  
  var vals = [];
  var settings = Object.keys(settingsKeys);
  for(var i = 0; i < settings.length; i++)
  {
    vals.push([settingsKeys[settings[i]]]);
  }
  Logger.log(vals);
  
  settingsSheet.getRange("A1:A" + settings.length).setValues(vals);
}

function parseSetting(key)
{
  var thisSpreadSheet = SpreadsheetApp.getActiveSpreadsheet();
  var settings = thisSpreadSheet.getSheetByName(settingsSheetName).getDataRange().getValues();
  
  for(var i = 0; i < settings.length; i++)
  {
    if(settings[i][0] == key)
    {
      if(isArray(settings[i].slice(1)))
      {
        return settings[i].slice(1);
      } else
      {
        return settings[i][1];
      }
    }
  }
  return '';
}

function isArray(arr)
{
  if(arr.length < 2)
  {
    return false;
  }
  var isEmpty = true;
  for(var i = 1; i < arr.length; i++)
  {
    if(arr[i] != '')
    {
      isEmpty = false;
    }
  }
  return !isEmpty;
}
  
function showError(txt)
{
  var ui = SpreadsheetApp.getUi();
  return ui.alert("Error", txt, ui.ButtonSet.OK);
}
