class LatexTokenizer {
    constructor(latexString) {
        this.latexString = latexString;
        this.index = 0;
        this.currentToken = '';
        this.result = [];
    }
    peek() {return this.latexString[this.index];}
    eat() {return this.latexString[this.index++];}
    tokenize() {
        while (this.index < this.latexString.length) {
            const numberCondition = peeked => /\d/.test(peeked) || peeked == '.';
            if (this.peek() == '\\') {
                this.currentToken += this.eat();
                while (/[A-Za-z]/.test(this.peek())) {
                    this.currentToken += this.eat();
                }
                if (['\\times', '\\cdot', '\\ast', '\\div', '\\slash'].includes(this.currentToken)) {
                    this.result.push({
                        'type': 'operator',
                        'symbol': this.currentToken
                    });
                } else if ((token => token == '\\left' || token == '\\right')(this.currentToken)) {
                    this.result.push({
                        'type': 'delimiter command',
                        'command': this.currentToken
                    });
                } else if (['\\lbrace', '\\rbrace', '\\lbrack', '\\rbrack'].includes(this.currentToken)) {
                    this.result.push({
                        'type': 'delimiter',
                        'symbol': this.currentToken
                    });
                } else {
                    this.result.push({
                        'type': 'command',
                        'command': this.currentToken
                    });
                }
                this.currentToken = '';
            } else if (numberCondition(this.peek())) {
                while (numberCondition(this.peek())) {
                    this.currentToken += this.eat();
                }
                this.result.push({
                    'type': 'number',
                    'value': this.currentToken
                });
                this.currentToken = '';
            } else if ((peeked => peeked == '(' || peeked == ')')(this.peek())) {
                this.result.push({
                    'type': 'delimiter',
                    'symbol': this.eat()
                });
            } else {
                if (this.peek() === ' ') {
                    this.eat();
                    continue;
                }
                if (/[A-Za-z]/.test(this.peek())) {
                    this.result.push({
                        'type': 'identifier',
                        'name': this.eat()
                    });
                } else if (['+', '-', '*', '/'].includes(this.peek())) {
                    this.result.push({
                        'type': 'operator',
                        'symbol': this.eat()
                    });
                } else if ((peeked => peeked == '^' || peeked == '_')(this.peek())) {
                    this.result.push({
                        'type': 'script operator',
                        'symbol': this.eat()
                    });
                } else if ((peeked => peeked == '{' || peeked == '}')(this.peek())) {
                    this.result.push({
                        'type': 'group operator',
                        'symbol': this.eat()
                    });
                } else {
                    this.eat();
                }
            }
        }
        return this.result;
    }
}
