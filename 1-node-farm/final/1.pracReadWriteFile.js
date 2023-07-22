const fs = require('fs');

// let text = "Hello World";
// console.log(text);


// let inputText = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(inputText);


// const outputText = fs.writeFileSync('./txt/output.txt',`This is what it is ${inputText} \n File Created on ${new Date}`);
// console.log(outputText);


fs.readFile('./txt/input.txt', 'utf-8', (err1, data1) => {
    fs.readFile('./txt/output.txt', 'utf-8', (err2, data2) => {
        fs.writeFile('./txt/outputWriteFile.txt', `${data1}\n${"FILE WRITTEN USING WRITEFILE"}\n ${data2}`, 'utf-8', err => {})
    })
})