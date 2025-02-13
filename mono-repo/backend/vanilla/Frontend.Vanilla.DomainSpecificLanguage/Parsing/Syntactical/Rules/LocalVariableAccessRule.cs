using System;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree;
using Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree.LocalVariables;
using Frontend.Vanilla.DomainSpecificLanguage.Parsing.Lexical;

namespace Frontend.Vanilla.DomainSpecificLanguage.Parsing.Syntactical.Rules;

internal sealed class LocalVariableAccessRule : ISyntaxRule
{
    public IExpressionTree? TryParse(ParsingContext context, ISyntaxParser parser)
    {
        if (context.ParsedExpressionOnLeft != null
            || !(context.CurrentToken is IdentifierToken idToken)
            || context.RemainingTokensOnRight.First.Is(Keyword.Dot)) // Provider access
            return null;

        LocalVariableAssignmentRule.VerifyLocalVariableName(idToken);

        if (!context.LocalVariables.TryGetValue(idToken.Value, out var type))
            throw new Exception(
                $"Local variable must be assigned before it's accessed but '{idToken.Value}' was not assigned anywhere before its usage at position {idToken.Position}."
                + $" Already assigned  local variables until this point: {context.LocalVariables.Keys.Dump()}.");

        return new LocalVariableAccess(type, idToken.Value);
    }

    public static string ToString(LocalVariableAccess access)
        => access.VariableName;
}
