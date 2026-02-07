class LatexTokenizer {
  constructor(latexString) {
    this.latexString = latexString;
    this.index = 0;
    this.currentToken = '';
    this.result = [];
    // Debuggers
    this.repetitionAmount = 0;
    this.stopped = false;
  }
  peek() { return this.latexString[this.index]; }
  eat() { return this.latexString[this.index++]; }
  tokenize() {
    while (this.index < this.latexString.length) {
      if (this.peek() == '\\') {
        const testToken = new CommandParser(this.latexString, this.index).parseCommand();
        if (['\\times', '\\cdot', '\\ast', '\\div', '\\slash'].includes(testToken.commandName)) {
          testToken.type = 'operator';
        } else if ((token => token == '\\left' || token == '\\right')(testToken.commandName)) {
          testToken.type = 'delimiter command';
        } else if (['\\lbrace', '\\rbrace', '\\lbrack', '\\rbrack'].includes(testToken.commandName)) {
          testToken.type = 'delimiter';
        } else {
          testToken.type = 'command';
        }
        this.result.push(testToken)
        this.currentToken = '';
      } else if (/\d/.test(this.peek())) {
        const testToken = new NumberParser(this.latexString, this.index).parseDigit();
        this.result.push(testToken);
        this.currentToken = '';
      } else if ((peeked => ['(', ')', '[', ']'].includes(peeked))(this.peek())) {
        this.result.push({
          'type': 'delimiter',
          'symbol': this.eat()
        });
      } else {
        if (/\s/.test(this.peek())) {
          this.eat();
          continue;
        }
        let tokenType, tokenName = 'symbol', putToken = true;
        if (/[A-Za-z]/.test(this.peek())) {
          tokenType = 'identifier';
          tokenName = 'name';
        } else if (['+', '-', '*', '/'].includes(this.peek())) {
          tokenType = 'operator';
        } else if ((peeked => peeked == '^' || peeked == '_')(this.peek())) {
          tokenType = 'script operator';
        } else if ((peeked => peeked == '{' || peeked == '}')(this.peek())) {
          tokenType = 'group delimiter';
        } else {
          putToken = false;
          this.eat();
        }
        
        if (putToken) {
          this.result.push({
            'type': tokenType,
            [tokenName]: this.eat()
          });
        }
      }
    }
    return this.result;
  }
}

