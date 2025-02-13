using System.Linq;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree;
using Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree.Operations;
using Frontend.Vanilla.DomainSpecificLanguage.Parsing.Lexical;

namespace Frontend.Vanilla.DomainSpecificLanguage.Parsing.Syntactical.Rules;

internal sealed class TernaryConditionalOperationRule : ISyntaxRule
{
    public IExpressionTree? TryParse(ParsingContext context, ISyntaxParser parser)
    {
        if (!context.CurrentToken.Is(Keyword.QuestionMark))
            return null;

        var position = context.CurrentToken.Position;
        var condition = context.ParsedExpressionOnLeft;

        if (condition?.ResultType != DslType.Boolean)
            throw new ParseException(position, $"{Keyword.QuestionMark} requires {DslType.Boolean} condition on the left"
                                               + $" to create ternary conditional operation but there is {condition?.ResultType.ToString() ?? "nothing"}.");

        var consequent = parser.ParseExpressionFromRemainingTokensOnRight(context);

        if (consequent == null || !TernaryConditionalOperation.SupportedTypes.Contains(consequent.ResultType))
            throw new ParseException(position, $"{Keyword.QuestionMark} requires {TernaryConditionalOperation.SupportedTypes.Join(" or ")} expression on the right"
                                               + $" to create ternary conditional operation but there is {consequent?.ResultType.ToString() ?? "nothing"}.");

        var nextToken = context.RemainingTokensOnRight.First?.Value;

        if (nextToken == null || !nextToken.Is(Keyword.Colon))
            throw new ParseException(position, $"Ternary conditional operation must contain {Keyword.Colon} and then alternative expression"
                                               + $" but instead of {Keyword.Colon} there is {nextToken?.ToString() ?? "nothing"}.");

        position = nextToken.Position;
        context.RemainingTokensOnRight.RemoveFirst();

        var alternative = parser.ParseExpressionFromRemainingTokensOnRight(context);

        if (alternative?.ResultType != consequent.ResultType)
            throw new ParseException(position, $"{Keyword.Colon} must be followed by {consequent.ResultType} expression (same as consequent expression type) on the right"
                                               + $" but there is {consequent.ResultType.ToString() ?? "nothing"}.");

        return new TernaryConditionalOperation(condition, consequent, alternative);
    }

    public static string ToString(TernaryConditionalOperation operation)
        => ExpressionInParenthesesRule.ToString(string.Join(" ",
            operation.Condition,
            Keyword.QuestionMark.Value,
            operation.Consequent,
            Keyword.Colon.Value,
            operation.Alternative));
}
