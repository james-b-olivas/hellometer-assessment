# Hellometer Assessment: Slow Time Checker

An app that takes in CSV data gathered by Hellometer, and analyzes it to determine how many people were left waiting for too long on a given day.

# Requirements:

Node (v.14.x)

# Setup Instructions

To install all dependencies, run ```npm install```.

To start the server, run ```npm run build:dev``` in one terminal, and ```npm start``` in another.

# Usage Instructions

In the first text field, input an integer value representing the number of time units that you consider to be too slow.

In the second text field, input a number between 22 and 29, which represents one of the dates that the CSV file encompasses.

Once those are done, click "Process Data". This will query the server for the CSV file, and tell you how many people waited for too long on the day that you selected.
