/**
 * Searches for matches in scanned text.
 * @param {string} searchTerm - The word or term we're searching for. 
 * @param {JSON} scannedTextObj - A JSON object representing the scanned text.
 * @returns {JSON} - Search results.
 * */ 
 function findSearchTermInBooks(searchTerm, scannedTextObj) {
    /** You will need to implement your search and 
     * return the appropriate object here. */

    //format: IBSN, Page, Line

    function cleanWord(word) {
        /**
         * removes punctuation from word
         * keeps all letters, hyphens, and apostrophes
         * */
        var newWord = "";
        for (i = 0; i < word.length; i++) {
            if ((/[a-zA-Z]/).test(word[i]) || (/\-/).test(word[i]) || (/\'/).test(word[i])) {
                newWord = newWord.concat(word[i])
            }
        }
        return newWord
    }

    function pushToResult(results, ISBN, page, line) {
        results.push({"ISBN": ISBN, "Page": page, "Line": line});
    }

    var results = [];
    var carryWord, content, ISBN, text, words, word; //declaring variables outside loop
    for (let b = 0; b < scannedTextObj.length; b++) {
        ISBN = scannedTextObj[b].ISBN;
        content = scannedTextObj[b].Content;
        carryWord = "";
        for (let lineNum = 0; lineNum < content.length; lineNum++) {
            text = content[lineNum].Text;
            words = text.split(/\s+/)
            for (let w = 0; w < words.length; w++) {
                word = cleanWord(words[w]);
                if (w == 0) {
                    if (carryWord.length > 0 && carryWord.concat(word) == searchTerm) {
                        //will push line where word begins (e.g. line containing "dark-")
                        pushToResult(results, ISBN, content[lineNum-1].Page, content[lineNum-1].Line);
                    }
                    else if (carryWord.length == 0 && searchTerm == word) {
                        pushToResult(results, ISBN, content[lineNum].Page, content[lineNum].Line)
                    }
                    carryWord = ""; //reset carryWord
                }
                else if (w == words.length-1) { 
                    if (word.charAt(word.length-1) == '-') {
                        carryWord = word.slice(0, word.length-1) //everything except last char (hyphen)
                        //don't push anything if last word is first half of a word, need to check next line
                    }
                    else if (word == searchTerm) {
                        pushToResult(results, ISBN, content[lineNum].Page, content[lineNum].Line);
                    }
                }
                else {
                    if (word == searchTerm) {
                        pushToResult(results, ISBN, content[lineNum].Page, content[lineNum].Line);
                    }
                }
            }
        }
    }

    var output = {
        "SearchTerm": searchTerm,
        "Results": results
    };
    
    return output; 
}

/** Example input object. */
const twentyLeaguesIn = [
    {
        "Title": "Twenty Thousand Leagues Under the Sea",
        "ISBN": "9780000528531",
        "Content": [
            {
                "Page": 31,
                "Line": 8,
                "Text": "now simply went on by her own momentum.  The dark-"
            },
            {
                "Page": 31,
                "Line": 9,
                "Text": "ness was then profound; and however good the Canadian\'s"
            },
            {
                "Page": 31,
                "Line": 10,
                "Text": "eyes were, I asked myself how he had managed to see, and"
            } 
        ] 
    }
]

const nullBook = [{
    "Title": "NotMuchToSeeHere",
    "ISBN": "00000",
    "Content": []

}]

const goodReads = [twentyLeaguesIn[0], 
    {
        "Title": "Headlines",
        "ISBN": "41666666",
        "Content": [
            {
                "Page": 1,
                "Line": 1,
                "Text": "I might be too strung out on compliments, overloaded on conf-"
            },
            {
                "Page": 1,
                "Line": 2,
                "Text": "idence, started not to be bothered but stopped fearing the c-"
            },
            {
                "Page": 2,
                "Line": 7,
                "Text": "onsequence; ingesting in the evening hours because I ingest to my accomplishments."
            },
            {
                "Page": 2,
                "Line": 8,
                "Text": "Faded way too long I\'m floating in and out of consciousness"
            } 
        ] 
    }];
    
/** Example output object */
const twentyLeaguesOut = {
    "SearchTerm": "the",
    "Results": [
        {
            "ISBN": "9780000528531",
            "Page": 31,
            "Line": 9
        }
    ]
}

/*
 _   _ _   _ ___ _____   _____ _____ ____ _____ ____  
| | | | \ | |_ _|_   _| |_   _| ____/ ___|_   _/ ___| 
| | | |  \| || |  | |     | | |  _| \___ \ | | \___ \ 
| |_| | |\  || |  | |     | | | |___ ___) || |  ___) |
 \___/|_| \_|___| |_|     |_| |_____|____/ |_| |____/ 
                                                      
 */

/* We have provided two unit tests. They're really just `if` statements that 
 * output to the console. We've provided two tests as examples, and 
 * they should pass with a correct implementation of `findSearchTermInBooks`. 
 * 
 * Please add your unit tests below.
 * */

/** We can check that, given a known input, we get a known output. */

function sandboxTest(term) {
    case1 = findSearchTermInBooks(term, twentyLeaguesIn);
    console.log("----CUSTOM TEST-----");
    console.log(case1);
}

sandboxTest("now")

var MultilineTestOut = {
    SearchTerm: 'darkness',
    Results: [
      { ISBN: '9780000528531', Page: 31, Line: 8 },
      //{ ISBN: '9780000528531', Page: 31, Line: 9 }
    ]
  };

const MultilineTestResult = findSearchTermInBooks("darkness", goodReads);
if (JSON.stringify(MultilineTestOut) === JSON.stringify(MultilineTestResult)) {
    console.log("PASS: Custom Test 1");
} else {
    console.log("FAIL: Custom Test 1");
    console.log("Expected:", MultilineTestOut);
    console.log("Received:", MultilineTestResult);
}

var FirstHalfMultilineOut = {
    SearchTerm: 'dark',
    Results: []
  };

const FirstHalfMultilineResult = findSearchTermInBooks("dark", twentyLeaguesIn);
if (JSON.stringify(FirstHalfMultilineOut) === JSON.stringify(FirstHalfMultilineResult)) {
    console.log("PASS: Custom Test 2");
} else {
    console.log("FAIL: Custom Test 2");
    console.log("Expected:", FirstHalfMultilineOut);
    console.log("Received:", FirstHalfMultilineResult);
}

var SecondHalfMultilineOut = {
    SearchTerm: 'ness',
    Results: []
  };

const SecondHalfMultilineResult = findSearchTermInBooks("ness", twentyLeaguesIn);
if (JSON.stringify(SecondHalfMultilineOut) === JSON.stringify(SecondHalfMultilineResult)) {
    console.log("PASS: Custom Test 3");
} else {
    console.log("FAIL: Custom Test 3");
    console.log("Expected:", SecondHalfMultilineOut);
    console.log("Received:", SecondHalfMultilineResult);
}

var ApostropheTestOut = {
    SearchTerm: "Canadian\'s",
    Results: [
      { ISBN: '9780000528531', Page: 31, Line: 9 }
    ]
  };

  const ApostropheTestResult = findSearchTermInBooks("Canadian\'s", goodReads);
  if (JSON.stringify(ApostropheTestOut) === JSON.stringify(ApostropheTestResult)) {
      console.log("PASS: Custom Test 4");
  } else {
      console.log("FAIL: Custom Test 4");
      console.log("Expected:", ApostropheTestOut);
      console.log("Received:", ApostropheTestResult);
  }

  const firstWordEdgeCaseOut = {
    SearchTerm: 'now',
    Results: [ { ISBN: '9780000528531', Page: 31, Line: 8 } ]
  }

  const firstWordEdgeCaseResult = findSearchTermInBooks("now", twentyLeaguesIn);
  if (JSON.stringify(firstWordEdgeCaseOut) === JSON.stringify(firstWordEdgeCaseResult)) {
      console.log("PASS: First Word Edge Case");
  } else {
      console.log("FAIL: First Word Edge Case");
      console.log("Expected:", firstWordEdgeCaseOut);
      console.log("Received:", firstWordEdgeCaseResult);
  }

const test1result = findSearchTermInBooks("the", twentyLeaguesIn);
if (JSON.stringify(twentyLeaguesOut) === JSON.stringify(test1result)) {
    console.log("PASS: Test 1");
} else {
    console.log("FAIL: Test 1");
    console.log("Expected:", twentyLeaguesOut);
    console.log("Received:", test1result);
}

/** We could choose to check that we get the right number of results. */
const test2result = findSearchTermInBooks("the", twentyLeaguesIn); 
if (test2result.Results.length == 1) {
    console.log("PASS: Test 2");
} else {
    console.log("FAIL: Test 2");
    console.log("Expected:", twentyLeaguesOut.Results.length);
    console.log("Received:", test2result.Results.length);
}