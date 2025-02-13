using System;
using System.Linq;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree;
using Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree.Operations;
using Frontend.Vanilla.DomainSpecificLanguage.Parsing.Lexical;

namespace Frontend.Vanilla.DomainSpecificLanguage.Parsing.Syntactical.Rules;

internal sealed class BinaryOperationRule : ISyntaxRule
{
    public IExpressionTree? TryParse(ParsingContext context, ISyntaxParser parser)
    {
        if (!(context.CurrentToken is KeywordToken operatorToken))
            return null;

        var operatorsWithKeyword = BinaryOperators.Operators.Where(o => operatorToken.Keyword == o.Keyword).ToList();

        if (operatorsWithKeyword.Count == 0)
            return null;

        if (context.PreviousOperator != null
            && context.PreviousOperator.Keyword != Keyword.Not
            && UnaryOperators.Operators.Any(o => o.Keyword == context.PreviousOperator.Keyword))
            return null; // Unary operators have the highest precedence except NOT b/c there was shitty parser -> people used it -> keep it :-(

        if (context.PreviousOperator != null && operatorToken.Keyword.EqualsAny(Keyword.And, Keyword.Or))
        {
            var conflictingOperator = operatorToken.Keyword == Keyword.And ? Keyword.Or : Keyword.And;

            if (context.PreviousOperator?.Keyword == conflictingOperator)
                throw new Exception(
                    $"The {context.CurrentToken} conflicts with previous {context.PreviousOperator}. Use parentheses to make the expression unambiguous.");

            return null; // Other operators have higher precedence than OR/AND
        }

        if (context.PreviousOperator?.Keyword == Keyword.SubstringFrom && operatorToken.Keyword == Keyword.Take)
            return null;

        var leftOperand = GuardNotNullOperand(context.ParsedExpressionOnLeft, "left");
        var rightExpression = parser.ParseExpressionFromRemainingTokensOnRight(context, previousOperator: operatorToken);
        var rightOperand = GuardNotNullOperand(rightExpression, "right");

        var @operator = operatorsWithKeyword.SingleOrDefault(o => o.LeftOperandType == leftOperand.ResultType && o.RightOperandType == rightOperand.ResultType);

        if (@operator == null)
            throw CreateException($"{operatorToken.Keyword} can't be used between {leftOperand.ResultType} on the left and {rightOperand.ResultType} on the right."
                                  + $" Supported operand types are: {operatorsWithKeyword.Select(x => $"(left: {x.LeftOperandType}, right: {x.RightOperandType})").Join(" or ")}.");

        return new BinaryOperation(@operator, leftOperand, rightOperand);

        IExpressionTree GuardNotNullOperand(IExpressionTree? operand, string side)
            => operand ?? throw CreateException($"{operatorToken.Keyword} requires an expression on the {side} but there is nothing.");

        Exception CreateException(string message)
            => new ParseException(operatorToken.Position, message);
    }

    public static string ToString(BinaryOperation operation)
        => ExpressionInParenthesesRule.ToString(string.Join(" ",
            operation.LeftOperand,
            operation.Operator.Keyword.Value,
            operation.RightOperand));
}
