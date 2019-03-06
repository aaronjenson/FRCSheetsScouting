# FRCSheetsScouting

Google Sheets Extension designed to easily manage [FRC](https://www.firstinspires.org/robotics/frc) match scouting data from an event. Uses a user defined template to create sheets for each team's data, allowing any normal computation and formatting that can be used with Google Sheets. Sheets extensions do not function on the mobile Google Sheets app.

## Setup Instructions

To get your sheet to load the scripts each time it opens. Do this first.

1. Create a Google Sheets to house your scouting data.
2. Create a Google Form for submitting match data. Each response to the form should submit information about a single robot in a single match
3. Link the Form with the Sheet.
4. In the Sheet, select the Tools menu and open the Script Editor. Paste the code from Code.gs into the editor and save.
5. From the Script Editor, under the Edit menu, select Current Project's Triggers. Click Add Trigger, and create a trigger to run the onOpen function (on the Head deployment) when the Sheet is opened.

## Usage Instructions

To set up your sheet for each event and show the data in a pretty way. Do this after the above setup instructions.

1. Create a template sheet. This sheet will be copied for each team. Details on how to create the template sheet are below. The template sheet should be named "template" to ensure that it can be found by the script.
2. Either a) create an api key for The Blue Alliance and find your event key OR b) fill in the teams list manually
3. In the Scouting menu, select Create Team Sheets to finish creating all the sheets for each team.
4. Submit data to your form, and reference the data using each team's sheet.

### Template Sheets

Not yet written

### API keys vs teamsList

Not yet written

### Sheet Documentation

Not yet written

### Menu Documentation

Not yet written
