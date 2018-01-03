# Column-to-Schema matching algorithm for CSV file uploads

## About This Project

Implemented using [RxJS observables](http://reactivex.io/rxjs/), because:

1. I needed practice
2. Observables are fast and efficient

H/T to @jfairbank for his excellent talk at [Connect.tech 2017](https://speakerdeck.com/jfairbank/connect-dot-tech-2017-dive-into-rxjs-observables) for inspiring me to commence this exercise.

### The Problem

We need to parse a user-supplied CSV data file, examine the column names in the first row and the contents of each column, and match field of a pre-defined schema to the column that is the best match.

We define "best match" as follows:

1. No more than 5% of the column values fail schema field validation, or 100% of the column values are blank
2. The column name is the most similar to the schema field name
3. The column appears in the file earliest

### Implementation

* Used take(), map(), and mergeAll() operators with ReplaySubject for streaming CSV column headers and row data
* ReplaySubject ensures that no items are missed when data is subscribed to repeatedly
* Since rows are represented by observables, only enough rows are read to supply the data needed for reading the header and computing the column validation score
* Column names are compared to the schema field name and aliases using the Dice Coefficient algorithm, which works better than Levenshtein

## Example

To demonstrate, run `npm run demo`.

List.csv:

```csv
"HHName","LastName","FirstName","MiddleName","SuffixName","PrimaryAddress1","PrimaryCity","PrimaryState","PrimaryZip","PrimaryZip4","PrimaryOddEvenCode","PrimaryHouseNumber","PrimaryHouseHalf","PrimaryStreetPre","PrimaryStreetName","PrimaryStreetType","PrimaryStreetPost","PrimaryUnit","PrimaryUnitNumber","PrimaryPhone","TelephoneReliabilityCode","HasPrimaryPhone","EMail","DOB","AgeRange","Age","Gender","OfficialParty","CalculatedParty","RegistrationDate","GeneralFrequency","PrimaryFrequency","OverAllFrequency","GeneralAbsenteeStatus","PrimaryAbsenteeStatus","Moved","CDName","LDName","SDName","CountyName","CountyNumber","PrecinctNumber","PrecinctName","DMA","Turf","CensusBlock","VoterKey","HHRecId","HHMemberId","HHCode","JurisdictionalVoterId","ClientId","StateVoterId","Latitude","Longitude","MD1Name","MD2Name","CellularPhone","HomePhone","OtherPhone"
"MICHAEL KASHA","KASHA","MICHAEL","C","","1621 S McDuffie St","Anderson","SC","29624","3367","O","1621","","S","McDuffie","St","","","","8642221492","","True","","6/19/1945","6","70","M","Unaffiliated","2 - Weak Republican","1/2/1996","4","4","4","","","False","3","8","4","Anderson","4","081","ANDERSON 4/2","GREENVLL-SPART-ASHEVLL-AND","None","45007000600","2157948","1018908","1","S","","11524251517","041904888","34.489912","-82.645473","Anderson- CC 02","Anderson- SB 55","","8642221492",""
"MAY HEMBREE","HEMBREE","MAY","B","","1506 White St","Anderson","SC","29624","3414","E","1506","","","White","St","","","","8646100148","6","True","","1/14/1961","4","55","F","Unaffiliated","3 - Swing","4/21/2015","5","5","5","","","False","3","8","4","Anderson","4","081","ANDERSON 4/2","GREENVLL-SPART-ASHEVLL-AND","None","45007000600","2157422","834964","1","S","","11524250991","235723185","34.491968","-82.638496","Anderson- CC 02","Anderson- SB 55","","8646100148",""
"STEVE CHEEK","CHEEK","STEVE","R","","215 Beaty Sq","Anderson","SC","29624","1101","O","215","","","Beaty","Sq","","","","8642269903","9","True","","2/11/1951","6","65","M","Unaffiliated","1 - Hard Republican","5/25/1972","4","3","4","","","False","3","8","4","Anderson","4","082","ANDERSON 5/A","GREENVLL-SPART-ASHEVLL-AND","None","45007000700","2161864","334231","1","S","","11524255433","041239469","34.502244","-82.678952","Anderson- CC 02","Anderson- SB 55","","8642269903",""
"STEPHANIE MARZETTE","MARZETTE","STEPHANIE","D","","103 Brown St","Anderson","SC","29624","1301","O","103","","","Brown","St","","","","","","False","","11/11/1957","5","58","F","Unaffiliated","3 - Swing","9/4/2015","5","5","5","","","False","3","8","4","Anderson","4","082","ANDERSON 5/A","GREENVLL-SPART-ASHEVLL-AND","None","45007000700","2183505","1196504","1","S","","11524277074","235791278","34.503126","-82.665886","Anderson- CC 02","Anderson- SB 55","","",""
"JESSIE FLEMING","FLEMING","JESSIE","L","","106 Brown St","Anderson","SC","29624","1302","E","106","","","Brown","St","","","","8647600652","9","True","","8/8/1973","3","42","M","Unaffiliated","1 - Hard Republican","3/9/1992","4","3","3","","","False","3","8","4","Anderson","4","082","ANDERSON 5/A","GREENVLL-SPART-ASHEVLL-AND","None","45007000700","2162530","604089","1","S","","11524256099","044216943","34.503094","-82.665886","Anderson- CC 02","Anderson- SB 55","","8647600652",""

```

Output:

```
Matched columns to schema:
[
  {
    "field": "firstName",
    "header": "FirstName",
    "index": 2
  },
  {
    "field": "lastName",
    "header": "LastName",
    "index": 1
  },
  {
    "field": "email",
    "header": "EMail",
    "index": 22
  },
  {
    "field": "latitude",
    "header": "Latitude",
    "index": 53
  },
  {
    "field": "longitude",
    "header": "Longitude",
    "index": 54
  },
  {
    "field": "address",
    "header": "PrimaryAddress1",
    "index": 5
  },
  {
    "field": "city",
    "header": "PrimaryCity",
    "index": 6
  },
  {
    "field": "state",
    "header": "PrimaryState",
    "index": 7
  },
  {
    "field": "zip",
    "header": "PrimaryZip",
    "index": 8
  }
]

First three rows of data matched to schema:
[
  {
    "firstName": "MICHAEL",
    "lastName": "KASHA",
    "latitude": "34.489912",
    "longitude": "-82.645473",
    "address": "1621 S McDuffie St",
    "city": "Anderson",
    "state": "SC",
    "zip": "29624",
    "$unmatched": {
      "HHName": "MICHAEL KASHA",
      "MiddleName": "C",
      "PrimaryZip4": "3367",
      "PrimaryOddEvenCode": "O",
      "PrimaryHouseNumber": "1621",
      "PrimaryStreetPre": "S",
      "PrimaryStreetName": "McDuffie",
      "PrimaryStreetType": "St",
      "PrimaryPhone": "8642221492",
      "HasPrimaryPhone": "True",
      "DOB": "6/19/1945",
      "AgeRange": "6",
      "Age": "70",
      "Gender": "M",
      "OfficialParty": "Unaffiliated",
      "CalculatedParty": "2 - Weak Republican",
      "RegistrationDate": "1/2/1996",
      "GeneralFrequency": "4",
      "PrimaryFrequency": "4",
      "OverAllFrequency": "4",
      "Moved": "False",
      "CDName": "3",
      "LDName": "8",
      "SDName": "4",
      "CountyName": "Anderson",
      "CountyNumber": "4",
      "PrecinctNumber": "081",
      "PrecinctName": "ANDERSON 4/2",
      "DMA": "GREENVLL-SPART-ASHEVLL-AND",
      "Turf": "None",
      "CensusBlock": "45007000600",
      "VoterKey": "2157948",
      "HHRecId": "1018908",
      "HHMemberId": "1",
      "HHCode": "S",
      "ClientId": "11524251517",
      "StateVoterId": "041904888",
      "MD1Name": "Anderson- CC 02",
      "MD2Name": "Anderson- SB 55",
      "HomePhone": "8642221492"
    }
  },
  {
    "firstName": "MAY",
    "lastName": "HEMBREE",
    "latitude": "34.491968",
    "longitude": "-82.638496",
    "address": "1506 White St",
    "city": "Anderson",
    "state": "SC",
    "zip": "29624",
    "$unmatched": {
      "HHName": "MAY HEMBREE",
      "MiddleName": "B",
      "PrimaryZip4": "3414",
      "PrimaryOddEvenCode": "E",
      "PrimaryHouseNumber": "1506",
      "PrimaryStreetName": "White",
      "PrimaryStreetType": "St",
      "PrimaryPhone": "8646100148",
      "TelephoneReliabilityCode": "6",
      "HasPrimaryPhone": "True",
      "DOB": "1/14/1961",
      "AgeRange": "4",
      "Age": "55",
      "Gender": "F",
      "OfficialParty": "Unaffiliated",
      "CalculatedParty": "3 - Swing",
      "RegistrationDate": "4/21/2015",
      "GeneralFrequency": "5",
      "PrimaryFrequency": "5",
      "OverAllFrequency": "5",
      "Moved": "False",
      "CDName": "3",
      "LDName": "8",
      "SDName": "4",
      "CountyName": "Anderson",
      "CountyNumber": "4",
      "PrecinctNumber": "081",
      "PrecinctName": "ANDERSON 4/2",
      "DMA": "GREENVLL-SPART-ASHEVLL-AND",
      "Turf": "None",
      "CensusBlock": "45007000600",
      "VoterKey": "2157422",
      "HHRecId": "834964",
      "HHMemberId": "1",
      "HHCode": "S",
      "ClientId": "11524250991",
      "StateVoterId": "235723185",
      "MD1Name": "Anderson- CC 02",
      "MD2Name": "Anderson- SB 55",
      "HomePhone": "8646100148"
    }
  },
  {
    "firstName": "STEVE",
    "lastName": "CHEEK",
    "latitude": "34.502244",
    "longitude": "-82.678952",
    "address": "215 Beaty Sq",
    "city": "Anderson",
    "state": "SC",
    "zip": "29624",
    "$unmatched": {
      "HHName": "STEVE CHEEK",
      "MiddleName": "R",
      "PrimaryZip4": "1101",
      "PrimaryOddEvenCode": "O",
      "PrimaryHouseNumber": "215",
      "PrimaryStreetName": "Beaty",
      "PrimaryStreetType": "Sq",
      "PrimaryPhone": "8642269903",
      "TelephoneReliabilityCode": "9",
      "HasPrimaryPhone": "True",
      "DOB": "2/11/1951",
      "AgeRange": "6",
      "Age": "65",
      "Gender": "M",
      "OfficialParty": "Unaffiliated",
      "CalculatedParty": "1 - Hard Republican",
      "RegistrationDate": "5/25/1972",
      "GeneralFrequency": "4",
      "PrimaryFrequency": "3",
      "OverAllFrequency": "4",
      "Moved": "False",
      "CDName": "3",
      "LDName": "8",
      "SDName": "4",
      "CountyName": "Anderson",
      "CountyNumber": "4",
      "PrecinctNumber": "082",
      "PrecinctName": "ANDERSON 5/A",
      "DMA": "GREENVLL-SPART-ASHEVLL-AND",
      "Turf": "None",
      "CensusBlock": "45007000700",
      "VoterKey": "2161864",
      "HHRecId": "334231",
      "HHMemberId": "1",
      "HHCode": "S",
      "ClientId": "11524255433",
      "StateVoterId": "041239469",
      "MD1Name": "Anderson- CC 02",
      "MD2Name": "Anderson- SB 55",
      "HomePhone": "8642269903"
    }
  }
]
```
