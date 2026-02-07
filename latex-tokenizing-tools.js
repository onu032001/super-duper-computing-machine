class NumberParser {
  constructor(latexString, index) {
    this.latexString = latexString;
    this.index = index;
    // Debuggers
    this.repetitionAmount = 0;
    this.stopped = false;
  }
  peek() { return this.latexString[this.index]; }
  eat() { return this.latexString[this.index++]; }
  repetitionDebuggerFunction() {
    this.repetitionAmount++;
    if (this.repetitionAmount >= 100) {
      console.error(
        '%cNumberParser.repetitionDebuggerFunction: %cRepetition amount exceeded.',
        'font-weight: bold;',
        ''
      );
      this.stopped = true;
    }
  }
  parseDigit() {
    if (/\d/.test(this.peek())) {
      return {
        'type': 'digit',
        'value': this.eat()
      }
    } else {
      let ate = this.eat();
      return {
        'type': 'unknown',
        'value': ate
      };
    }
  }
  parseNumber() {
    let result = {
      'type': 'number',
      'value': ''
    };
    let testDigit = this.parseDigit();
    if (testDigit.type != 'unknown') {
      result.value += testDigit.value;
    }
    testDigit = this.parseDigit();
    this.repetitionAmount = 0;
    while (testDigit.type != 'unknown') {
      result.value += testDigit.value;
      testDigit = this.parseDigit();
    }
    if (testDigit.type == 'unknown' && testDigit.value == '.') {
      result.value += testDigit.value;
    }
    testDigit = this.parseDigit();
    this.repetitionAmount = 0;
    while (testDigit.type != 'unknown') {
      result.value += testDigit.value;
      testDigit = this.parseDigit();
    }
    return result;
  }
}

class CommandParser {
  constructor(latexString, index) {
    this.latexString = latexString;
    this.index = index;
    this.firstTry = true;
    // Debuggers
    this.repetitionAmount = 0;
    this.stopped = false;
  }
  peek() { return this.latexString[this.index]; }
  eat() { return this.latexString[this.index++]; }
  repetitionDebuggerFunction() {
    this.repetitionAmount++;
    if (this.repetitionAmount >= 100) {
      console.error(
        '%cCommandParser.repetitionDebuggerFunction: %cRepetition amount exceeded.',
        'font-weight: bold;',
        ''
      );
      this.stopped = true;
    }
  }
  parseLetter() {
    if (/[A-Za-z]/.test(this.peek())) {
      return {
        'type': 'letter',
        'value': this.eat()
      }
    } else {
      let ate = this.eat();
      return {
        'type': 'unknown',
        'value': ate
      };
    }
  }
  parseCommand() {
    let result = {
      'type': 'command',
      'commandName': ''
    };
    let testLetter = this.parseLetter();
    while (this.firstTry ? testLetter.value == '\\' : testLetter.type != 'unknown') {
      result.commandName += testLetter.value;
      this.firstTry = false;
      testLetter = this.parseLetter();
    }
    return result;
  }
}