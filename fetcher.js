const request = require('request');
const fs = require('fs');
const readline = require('readline');

let url = process.argv[2];
let file = "Hey there!";

const fileBreak = process.argv[3].lastIndexOf("/");
const location = process.argv[3].substr(0, fileBreak + 1);
const fileName = process.argv[3].substr(fileBreak + 1);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// console.log(`${url} - ${fileBreak} - ${location} - ${fileName}`);

//check if file exists
fs.access(location + fileName, fs.F_OK, (err) => {
  request(url, (error, response, body) => {
    // console.log(`URL okay? ${error} ${response} ${response.statusCode}`);
  
    if (error !== null || response.statusCode !== 200) {
      console.error("URL incorrect");
      process.exit("-1");

      //exit with error
    }
    // console.log(`URL okay! ${error} ${response} ${response.statusCode}`);
    file = body;
    // end of requesting URL data

    if (!err) { 
      console.log(`${location}${fileName} file exists`);
      rl.question(`File already exists: do you want to overwrite? (Y/n)\n`, (answer) => {
        if (answer === "y" || answer === "Y") {
          fs.writeFile(location + fileName, file, function(errs) {
            if (errs) {
              console.error("Write to file issue");
              rl.close();
              return;
            }
            let bytes = fs.statSync(location + fileName).size;
            console.log(`Downloaded and saved ${bytes} bytes to ${location}${fileName}`);
            rl.close();
          });
          //end of write file for overwrite
        }
        //end of if confirmation
        rl.close();
      });
      //end of question
    } else {
      //write to file if no error to location and file name
      fs.writeFile(location + fileName, file, function(err) {
        if (err) {
          return console.log(err);
        }
        let bytes = fs.statSync(location + fileName).size;
        console.log(`Downloaded and saved ${bytes} bytes to ${location}${fileName}`);
        rl.close(); // process.exit(0) is another alternative
      });
    }
    // writing to file
  });
});
// end of checking if file exists