using Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree;

namespace Frontend.Vanilla.DomainSpecificLanguage.Parsing.Syntactical;

internal interface ISyntaxRule
{
    IExpressionTree? TryParse(ParsingContext context, ISyntaxParser parser);
}
