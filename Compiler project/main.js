/*global console */
/*jslint es6 */


const submitButton = document.querySelector("#submitbtn");


function onSubmit(e) {
    e.preventDefault();

    // intializing
    let count = 0;
    let buffer = "";
    const keywords = {
        "auto": 0,
        "break": 0,
        "case": 0,
        "char": 0,
        "const": 0,
        "continue": 0,
        "default": 0,
        "do": 0,
        "double": 0,
        "else": 0,
        "enum": 0,
        "extern": 0,
        "float": 0,
        "for": 0,
        "goto": 0,
        "if": 0,
        "inline": 0,
        "int": 0,
        "long": 0,
        "register": 0,
        "restrict": 0,
        "return": 0,
        "short": 0,
        "signed": 0,
        "sizeof": 0,
        "static": 0,
        "struct": 0,
        "switch": 0,
        "typedef": 0,
        "union": 0,
        "unsigned": 0,
        "void": 0,
        "volatile": 0,
        "while": 0
    };
    const whitespace = {
        " ": 0,
        "\t": 0,
        "\n": 0,
        "\v": 0,
        "\f": 0,
        "\b": 0
    };
    const operators = {
        "+": 0,
        "-": 0,
        "*": 0,
        "/": 0,
        "%": 0,
        ">": 0,
        "<": 0,
        "!": 0,
        "=": 0,
        "&": 0,
        "|": 0,
        "^": 0,
        "~": 0,
        ":": 0,
        "?": 0
    };
    const compoundOperators = {
        "++": 0,
        "--": 0,
        "==": 0,
        "<=": 0,
        ">=": 0,
        "!=": 0,
        "&&": 0,
        "||": 0,
        "<<": 0,
        ">>": 0,
        "+=": 0,
        "-=": 0,
        "*=": 0,
        "/=": 0,
        "%=": 0,
        "&=": 0,
        "|=": 0,
        "^=": 0,
        ">>=": 0,
        "<<=": 0
    };
    const separators = {
        ",": 0,
        ";": 0,
        "(": 0,
        ")": 0,
        "[": 0,
        "]": 0,
        "{": 0,
        "}": 0
    };
    const textMarkers = {
        "\"": 0,
        "'": 0
    };
    const delimiter = Object.assign({}, whitespace, operators, separators, textMarkers);

    const tokens = [];
    const tableData = [];

    // helper functions
    function emptyBuffer() {
        /* Pushes buffer contents into tokens if buffer is non-empty*/
        if (buffer != "") {
            tokens.push(buffer);
            count += 1;
            buffer = "";
        }
    }

    function generateTableData() {
        /* mutates tableData using tokens */
        for (let token in tokens) {
            // finding object in tableData whch has name equal to token
            let obj = tableData.find(obj => obj.Token === tokens[token]);
            // token not found
            if (obj === undefined) {
                obj = {
                    "Token": tokens[token],
                    "Count": 1
                };
                tableData.push(obj);
            }
            // token found
            else {
                obj.Count += 1;
            }
        }
    }

    function generateTableHead(table, data) {
        /* Generates table heading */
        let thead = table.createTHead();
        let row = thead.insertRow();
        for (let key of data) {
            let th = document.createElement("th");
            let text = document.createTextNode(key);
            th.appendChild(text);
            row.appendChild(th);
        }
    }

    function generateTable(table, data) {
        /* Generates table body */
        for (let element of data) {
            let row = table.insertRow();
            for (key in element) {
                let cell = row.insertCell();
                let text = document.createTextNode(element[key]);
                cell.appendChild(text);
            }
        }
    }


    // cleaing up HTML
    let table = document.querySelector("table");
    table.textContent = ""


    // Getting input code
    const txtarea = document.querySelector("#inputCode");
    const code = txtarea.value.trim();


    // iterating over code
    for (let i = 0; i < code.length; i++) {

        // Checking for single line comments
        if (code[i] === "/" && code[i + 1] === "/") {
            while (code[i] != "\n" && i < code.length) {
                i++;
                continue;
            }
        }

        // Checking for multi line comments
        if (code[i] === "/" && code[i + 1] === "*") {
            emptyBuffer();
            i += 2; // avoiding checking the same (*)
            while (code[i] != "*" || code[i + 1] != "/") {
                if (i >= code.length - 1) { // Complete code traversed
                    // TODO - add error message to DOM
                    console.log("Comment not ended");
                    return;
                }
                i++;
                continue;
            }
            i += 2; // skipping end of multiline comment
        }

        // Checking for strings
        if (code[i] === "\"") {
            emptyBuffer();
            buffer += code[i]; // taking in starting " in buffer
            i++; // avoiding checking the same (")
            while (code[i] != "\"" || (code[i - 1] === "\\" && code[i - 2] != "\\")) {
                if (i >= code.length - 1) { // Complete code traversed
                    // TODO - add error message to DOM
                    console.log("String not ended");
                    return;
                }
                buffer += code[i];
                i++;
            }
            buffer += code[i]; // taking in ending " in buffer
        }

        // Checking for characters
        if (code[i] === "'") {
            emptyBuffer();
            buffer += code[i]; // taking in starting ' in buffer
            i++; // avoiding checking the same (')
            while (code[i] != "'" || (code[i - 1] === "\\" && code[i - 2] != "\\")) {
                if (i >= code.length - 1) { // Complete code traversed
                    // TODO - add error message to DOM
                    return;
                }
                buffer += code[i];
                i++;
            }
            buffer += code[i]; // taking in ending ' in buffer
        }


        //        // check if index exceeded bounds 
        //        if (i >= code.length) {
        //            console.log("break in if statement achieved");
        //            break;
        //        }

        // tokeinzing code using delimiters
        if (buffer != "" && code[i] in delimiter) {
            emptyBuffer();
        }


        // handling delimiters
        if (code[i] in whitespace) { // ignoring whitespace
            continue;
        } else if (code[i] in textMarkers) { // textMarkers already in buffer
            continue;
        } else if (code[i] in separators) { // tokenizing separators
            buffer += code[i];
            emptyBuffer();
        } else if (code[i] in operators) {
            // checking for compound operators
            if (code[i] + code[i + 1] in compoundOperators) { // tokenizning 2 character operators
                buffer += code[i] + code[i + 1];
                emptyBuffer();
                i++;
            } else { // tokenizing one character operators
                buffer += code[i];
                emptyBuffer();
            }
        } else if (i === code.length - 1) { // pushing everything in buffer when input code ends
            buffer += code[i];
            emptyBuffer();
        } else { // inputting normal character
            buffer += code[i];
        }

    }

    //    console.log(count);
    //    console.log(tokens);

    generateTableData();
    //    console.log(tableData);


    // tableData is not empty
    if (tableData.length > 0) {
        let data = Object.keys(tableData[0]);
        generateTable(table, tableData);
        generateTableHead(table, data);

    }
    // tableData is empty
    else {
        // TODO - add error message to DOM
        return;
    }


    // clear fields
    //    txtarea.value = "";
    console.log("Code reached");
}


submitButton.addEventListener("click", onSubmit);

/*
TODO - add css
TODO - add lexemes
*/
