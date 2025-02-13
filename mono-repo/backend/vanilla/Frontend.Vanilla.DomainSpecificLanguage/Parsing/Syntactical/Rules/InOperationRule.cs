using System;
using Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree;
using Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree.Operations;
using Frontend.Vanilla.DomainSpecificLanguage.Parsing.Lexical;

namespace Frontend.Vanilla.DomainSpecificLanguage.Parsing.Syntactical.Rules;

internal sealed class InOperationRule : ISyntaxRule
{
    public IExpressionTree? TryParse(ParsingContext context, ISyntaxParser parser)
    {
        if (!context.CurrentToken.Is(Keyword.In))
            return null;

        if (!context.RemainingTokensOnRight.First.Is(Keyword.LeftSquareBracket))
            throw new Exception($"{Keyword.In} must be followed by {Keyword.LeftSquareBracket}"
                                + $" then values and then closed by {Keyword.RightSquareBracket}.");

        var values = ItemsInBracketsRule.ParseItemsInBrackets(context, Keyword.RightSquareBracket, itemsDescription: $"values for {Keyword.In}", parser);

        return new IsInListCondition(context.ParsedExpressionOnLeft, values);
    }
}
