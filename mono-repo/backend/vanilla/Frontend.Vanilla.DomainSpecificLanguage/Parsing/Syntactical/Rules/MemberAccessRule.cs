using System;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree;
using Frontend.Vanilla.DomainSpecificLanguage.Parsing.Lexical;

namespace Frontend.Vanilla.DomainSpecificLanguage.Parsing.Syntactical.Rules;

internal sealed class MemberAccessRule(IProviderAccessFactory providerAccessFactory) : ISyntaxRule
{
    public IExpressionTree? TryParse(ParsingContext context, ISyntaxParser parser)
    {
        if (!(context.CurrentToken is IdentifierToken providerNameId)
            || !context.RemainingTokensOnRight.First.Is(Keyword.Dot) || context.ParsedExpressionOnLeft != null)
            return null;

        if (!(context.RemainingTokensOnRight.First?.Next?.Value is IdentifierToken memberNameId))
            throw new Exception($"Identifier must be followed by {Keyword.Dot} and another Identifier to represent a provider property/function e.g. 'Foo.Bar'.");

        context.RemainingTokensOnRight.RemoveFirst(); // Skip dot
        context.RemainingTokensOnRight.RemoveFirst(); // Skip member

        var parameters = context.RemainingTokensOnRight.First.Is(Keyword.LeftParenthesis)
            ? ItemsInBracketsRule.ParseItemsInBrackets(
                context,
                Keyword.RightParenthesis,
                itemsDescription: $"parameters for function '{providerNameId.Value}.{memberNameId.Value}'",
                parser)
            : Array.Empty<IExpressionTree>();

        var (expression, warnings) = providerAccessFactory.Create(providerNameId.Value, memberNameId.Value, parameters);
        context.AllWarnings.Add(warnings);

        return expression;
    }
}
