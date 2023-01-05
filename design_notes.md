A couple notes on my design:

- I couldn't find any instructions on how to handle words spanning two lines (like darkness in the example book) - I decided to implement a solution that records the word appearing on its first line (e.g. darkness would be recorded as appearing on line 8). I decided against recording both lines on which such a word appears (i.e. recording darkness as being on lines 8 and 9), since this could be misinterpreted as two separate instances of the word appearing on two adjacent lines
- I assumed that punctuation was to be ignored (e.g. if searching for "profound" in the example text, you would want to match it with "profound;" and ignore the semicolon)
- In real production software, I'd also want to know the rationale behind making search terms case sensitive. I would ask if it would be more rational to make them case insensitive – for instance, if you wanted to find all instances of the word "Although," the word capitalized and not capitalized carries comparable if not the same meaning