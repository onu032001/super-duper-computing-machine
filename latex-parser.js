const multiplyAndDivide = ['\\times', '\\cdot', '\\ast', '*', '\\div', '\\slash', '/'];
const addAndSubtract = ['+', '-'];
class LatexParser {
  constructor(latexTokens) {
    this.latexTokens = latexTokens;
    this.index = 0;
  }
  peek() {return this.latexTokens[this.index];}
  eat() {return this.latexTokens[this.index++];}
  expressionToJSON() {
    let expressionResult = this.termToJSON();
    while (((peeked) => {
      if (!peeked) return false;
      return addAndSubtract.includes(peeked.symbol);
    })(this.peek())) {
      let operator = this.eat();
      let termResult = this.termToJSON();
      expressionResult = {
        'operation': operator,
        'leftValue': expressionResult,
        'rightValue': termResult
      };
    }
    return expressionResult;
  }
  termToJSON() {
    let termResult = this.factorToJSON();
    while (((peeked) => {
      if (!peeked) return false;
      return peeked.type == 'operator' && multiplyAndDivide.includes(peeked.symbol);
    })(this.peek())) {
      let operator = this.eat();
      let factorResult = this.factorToJSON();
      termResult = {
        'type': 'operator',
        'operation': operator,
        'leftValue': termResult,
        'rightValue': factorResult
      };
    }
    return termResult;
  }
  factorToJSON() {
    if (
      ((peeked) => {
        if (!peeked) return false;
        return peeked.type == 'group delimiter' && peeked.symbol == '{';
      })(this.peek())
    ) {
      this.eat();
      const expressionResult = this.parseExpression();
      this.eat();
      return expressionResult;
    } else if (
      ((peeked) => {
        if (!peeked) return false;
        return Object.keys(requiredArgs).includes(peeked);
      })(this.peek())
    ) {
      const ate = this.eat();
      let result = {
        'type': 'command operator',
        'commandName': ate.commandName,
        args: []
      };
      const args = requiredArgs[ate];
      for (let argIndex = 0; argIndex < args; argIndex++) {
        this.eat();
        const expressionResult = this.parseExpression();
        result.args.push(expressionResult);
      }
      return result;
    } else if (
      ((peeked) => {
        if (!peeked) return false;
        return peeked.type == 'delimiter command' && peeked.command == '\\left';
      })(this.peek())
    ) {
      let expressionResult;
      for (let tokenIndex = 0; tokenIndex < 5; tokenIndex++) {
        if (tokenIndex == 2) {
          expressionResult = this.parseExpression();
          continue;
        }
        this.eat();
      }
      return expressionResult;
    } else if (
      ((peeked) => {
        if (!peeked) return false;
        return peeked.type == 'delimiter';
      })(this.peek())
    ) {
      this.eat();
      const expressionResult = this.parseExpression();
      this.eat();
      return expressionResult;
    } else if (
      ((peeked) => {
        if (!peeked) return false;
        return ['number', 'identifier'].includes(peeked.type);
      })(this.peek())
    ) {
      const ate = this.eat();
      return {
        ...ate,
        'value': Number(ate.value)
      };
    }
  }
}
