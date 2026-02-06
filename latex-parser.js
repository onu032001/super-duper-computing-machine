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
      return ['+', '-'].includes(peeked.symbol);
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
      return peeked.type == 'operator' && ['\\times', '\\cdot', '\\ast', '*', '\\div', '\\slash', '/'].includes(peeked.symbol);
    })(this.peek())) {
      let operator = this.eat();
      let factorResult = this.factorToJSON();
      termResult = {
        'operation': operator,
        'leftValue': termResult,
        'rightValue': factorResult
      };
    }
    return termResult;
  }
  factorToJSON() {
    if (((peeked) => {
      if (!peeked) return false;
      return peeked.type == 'delimiter command' && peeked.command == '\\left';
    })(this.peek())) {
      this.eat();
      this.eat();
      const expressionResult = this.parseExpression();
      this.eat();
      this.eat();
      return expressionResult;
    } else if (((peeked) => {
      if (!peeked) return false;
      return peeked.type == 'delimiter' && peeked.symbol == '(';
    })(this.peek())) {
      this.eat();
      const expressionResult = this.parseExpression();
      this.eat();
      return expressionResult;
    } else if (((peeked) => {
      if (!peeked) return false;
      return ['number', 'identifier'].includes(peeked.type);
    })(this.peek())) {
      const ate = this.eat();
      return {
        ...ate,
        'value': Number(ate.value)
      };
    }
  }
}
