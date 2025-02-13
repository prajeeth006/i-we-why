using System;
using Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree;
using Frontend.Vanilla.DomainSpecificLanguage.Parsing.Lexical;

namespace Frontend.Vanilla.DomainSpecificLanguage.Parsing.Syntactical.Rules;

internal sealed class ExpressionInParenthesesRule : ISyntaxRule
{
    public IExpressionTree? TryParse(ParsingContext context, ISyntaxParser parser)
    {
        if (context.ParsedExpressionOnLeft != null
            || !context.CurrentToken.Is(Keyword.LeftParenthesis))
            return null;

        var expression = parser.ParseExpressionFromRemainingTokensOnRight(context);

        if (!context.RemainingTokensOnRight.First.Is(Keyword.RightParenthesis))
            throw new Exception($"{context.CurrentToken} is unclosed - missing corresponding {Keyword.RightParenthesis}.");
        if (expression == null)
            throw new Exception($"There is no relevant expression between {Keyword.LeftParenthesis} and {Keyword.RightParenthesis}.");

        context.RemainingTokensOnRight.RemoveFirst(); // Skip right parenthesis

        return expression;
    }

    public static string ToString(string expression)
        => Keyword.LeftParenthesis.Value + expression + Keyword.RightParenthesis.Value;
}
