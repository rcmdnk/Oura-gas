# Oura-gas
Google Apps Script for [Oura API](https://cloud.ouraring.com/docs/)

## Preparation

* Make new [Google Spreadsheet](https://sheet.new).
* Open script editor: **Tools**->**Script editor**.
* Add library: `1B7FSrk5Zi6L1rSxxTDgDEUsPzlukDsi4KGuTMorsTQHhGBzBkMun4iDF` (OAuth2).
* Make new script files, and copy all gs files in this repository.
* Make another script file, named `secret` with contents:

        var CLIENT_ID = 'XXX';
        var CLIENT_SECRET = 'XXX';
        var EMAIL = "mail@example.com";

    * CLIENT_ID and CLIENT_SECRET can be found as following:
        * Make sure you have a [Oura account](https://cloud.ouraring.com/account/login?next=%2F)
        * Make new application from [My Applications - Oura Developer API](https://cloud.ouraring.com/oauth/applications).
            * Redirect URIs (call back function) should be like: `https://script.google.com/macros/d/<SCRIPT_ID>/usercallback`
            * `SCRIPT_ID` is found in the menu of Apps Script: File -> Project properties -> Script Id
    * Get client id and client secret.
    * EMAIL will be used to notify when authorization is needed.

## Parameters

Edit params.gs if you want to change the parameters.


## Fill data in the spreadsheet

Run following functions:

* `fillPersonalInfo`: Personal information.
* `fillDailyReadiness`: Daily readiness data (scores).
* `fillDailySleep`: Daily sleep data (scores).
* `fillDailyStress`: Daily stress data.
* `fillSleep`: Sleep data (details).

## Schedule job

It is good to schedule the job to retrieve messages every day.

* Go `Trigger` (Clock icon) in the Apps Script project.
* `Add Trigger`
    * Choose which function to run: `fillSleep`
    * Which runs at deployment: `Head`
    * Select event source: `Time-driven`
    * Select type of time based trigger: `Day timer`
    * Select time of day: `0 am to 1 am`

This trigger fill sleep data between 0 am to 1 am every day.

Set triggers for other fillers as well.
