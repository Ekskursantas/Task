## INSTRUCTIONS
First you need to install some dependencies:

    npm install node-fetch
    npm install mocha chai --save-dev
After dependencies have been installed we type in our terminal:

    node app.js <filename>
There is already created .json file for testing called:

> input.json

The terminal will iterate through all the results.
## Testing
Added some Chai assertions unit tests:

> test/fetcherTest.js
> test/filereaderTest.js
> test/calculationsTest.js

The assertions.throws (in `test/calculationsTest.js`) test seemed to not work for me and I believe I have done it correctly.
**To run tests you have to write in terminal:**

    npm test
All the test will be ran through and the passed and failed test will be displayed in the terminal.

## Short Walkthrough

    

> app.js

This is primarily for starting the script and receive the arguments from the command line. We all so catch all the errors here that can be throw inside the functions.

> filereader.js

Using the given argument information from `app.js`we search for the given file and retrieve it, if there is no such file and error will be throw that file does not exist.

> commissions.js

This is the script were all the different requests are fetched.

> calculations.js

This is the main script where all the calculations for separate group of clients and type of transactions are performed. All the commission information is retrieved from `commissions.js` relying on async/await. There is also a `Date`function that will calculate the week number using the date of transaction.




