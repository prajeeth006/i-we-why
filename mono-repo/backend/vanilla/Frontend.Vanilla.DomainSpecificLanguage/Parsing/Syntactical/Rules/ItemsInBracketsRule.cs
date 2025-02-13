using System.Collections.Generic;
using Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree;
using Frontend.Vanilla.DomainSpecificLanguage.Parsing.Lexical;

namespace Frontend.Vanilla.DomainSpecificLanguage.Parsing.Syntactical.Rules;

internal static class ItemsInBracketsRule
{
    public static IReadOnlyList<IExpressionTree> ParseItemsInBrackets(ParsingContext context, Keyword closingBracket, string itemsDescription, ISyntaxParser parser)
    {
        var openingBracket = (KeywordToken)context.RemainingTokensOnRight.First!.Value;
        context.RemainingTokensOnRight.RemoveFirst(); // Skip opening bracket

        if (context.RemainingTokensOnRight.First.Is(closingBracket))
            throw new ParseException(openingBracket.Position, $"Some {itemsDescription} must be specified between {openingBracket.Keyword} and {closingBracket}.");

        var parsedItems = new List<IExpressionTree>();

        while (context.RemainingTokensOnRight.First != null)
        {
            var itemPosition = context.RemainingTokensOnRight.First.Value.Position;
            var itemExpression = parser.ParseExpressionFromRemainingTokensOnRight(context);
            parsedItems.Add(itemExpression ?? throw new ParseException(itemPosition, $"Particular one of {itemsDescription} isn't relevant expression."));

            if ((context.RemainingTokensOnRight.First?.Value).Is(closingBracket))
            {
                context.RemainingTokensOnRight.RemoveFirst();

                return parsedItems;
            }

            if (context.RemainingTokensOnRight.First.Is(Keyword.Comma))
                context.RemainingTokensOnRight.RemoveFirst();
            else
                throw new ParseException(itemPosition, $"Particular one of {itemsDescription} must be separated from next one by {Keyword.Comma}.");
        }

        throw new ParseException(openingBracket.Position, $"List of {itemsDescription} must be closed by {closingBracket}.");
    }
}
