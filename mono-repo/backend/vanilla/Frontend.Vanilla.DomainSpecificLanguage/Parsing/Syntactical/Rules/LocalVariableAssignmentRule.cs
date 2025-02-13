using System;
using Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree;
using Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree.LocalVariables;
using Frontend.Vanilla.DomainSpecificLanguage.Parsing.Lexical;

namespace Frontend.Vanilla.DomainSpecificLanguage.Parsing.Syntactical.Rules;

internal sealed class LocalVariableAssignmentRule : ISyntaxRule
{
    public IExpressionTree? TryParse(ParsingContext context, ISyntaxParser parser)
    {
        if (context.ParsedExpressionOnLeft != null
            || !(context.CurrentToken is IdentifierToken idToken)
            || !context.RemainingTokensOnRight.First.Is(Keyword.VariableAssignment))
            return null;

        VerifyLocalVariableName(idToken);
        context.RemainingTokensOnRight.RemoveFirst(); // Remove variable assignment keyword

        var valueToSet = parser.ParseExpressionFromRemainingTokensOnRight(context);

        if (valueToSet == null || valueToSet.ResultType == DslType.Void)
            throw new Exception(
                $"Assignment of a local variable must set relevant value on the right but for '{idToken.Value}' there is {valueToSet?.ResultType.ToString() ?? "nothing"}.");

        if (!context.LocalVariables.TryGetValue(idToken.Value, out var previousType))
            context.LocalVariables.Add(idToken.Value, valueToSet.ResultType);
        else if (previousType != valueToSet.ResultType)
            throw new Exception(
                $"Local variable must have same type in entire expression but '{idToken.Value}' is now assigned to a {valueToSet.ResultType} vs. previously it was a {previousType}.");

        return new LocalVariableAssignment(idToken.Value, valueToSet);
    }

    public static string ToString(LocalVariableAssignment assignment)
        => $"{assignment.VariableName} {Keyword.VariableAssignment.Value} {assignment.ValueToSet}";

    public static void VerifyLocalVariableName(IdentifierToken idToken)
    {
        if (!char.IsLower(idToken.Value.Value[0]))
            throw new Exception(
                $"Name of a local variable must start with a lower-case letter to clearly distinguish it from provider access but there is variable '{idToken.Value}'.");
        if (idToken.Value == ProviderAccess.ContextVariableName)
            throw new Exception(
                $"Local variable name '{ProviderAccess.ContextVariableName}' isn't allowed because it's reserved for evaluation context used internally.");
    }
}
