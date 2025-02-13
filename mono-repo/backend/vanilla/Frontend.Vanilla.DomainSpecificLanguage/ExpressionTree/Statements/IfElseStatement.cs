using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree.Operations;
using Frontend.Vanilla.DomainSpecificLanguage.Parsing.Lexical;
using Frontend.Vanilla.DomainSpecificLanguage.Parsing.Syntactical.Rules;

namespace Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree.Statements;

/// <summary>
/// If-else statement which executes either then or else statement based on the condition result.
/// </summary>
internal sealed class IfElseStatement(IExpressionTree condition, IExpressionTree thenStatement, IExpressionTree? elseStatement)
    : ExpressionTreeBase<IfElseStatement>
{
    public override DslType ResultType => DslType.Void;
    public IExpressionTree Condition { get; } = condition.GuardResultType(DslType.Boolean, nameof(condition));
    public IExpressionTree ThenStatement { get; } = thenStatement.GuardResultType(DslType.Void, nameof(thenStatement));
    public IExpressionTree? ElseStatement { get; } = elseStatement?.GuardResultType(DslType.Void, nameof(elseStatement));

    public override IEnumerable<IExpressionTree> GetChildren()
        => new[] { Condition, ThenStatement, ElseStatement }.WhereNotNull();

    private static readonly IUnaryOperator NotOperator = UnaryOperators.Operators.Single(o => o.Keyword == Keyword.Not);

    public override async Task<IExpressionTree> EvaluateAsync(EvaluationContext context)
    {
        var conditionEvaluated = await Condition.EvaluateAsync(context);

        if (!(conditionEvaluated is BooleanLiteral conditionLiteral))
        {
            // Clone context to isolate local variables b/c we don't know yet which statement will be finally taken
            var thenEvaluatedTask = ThenStatement.EvaluateAsync(context.Clone());
            var elseEvaluated = ElseStatement != null ? LiteralToNull(await ElseStatement.EvaluateAsync(context.Clone())) : null;
            var thenEvaluated = LiteralToNull(await thenEvaluatedTask); // Run in parallel

            // Discard all assigned local variables in statements b/c we don't know which one will be taken
            var usedLocalVariables = new[] { ThenStatement, ElseStatement }.WhereNotNull().SelectMany(s => s.GetLocalVariableUsages());
            foreach (var variable in usedLocalVariables.Where(v => v.Value.IsAssigned))
                context.LocalVariables[variable.Key] = null;

            // Remove empty statements, potentially whole if-else
            if (thenEvaluated == null)
                return elseEvaluated != null
                    ? new IfElseStatement(new UnaryOperation(NotOperator, conditionEvaluated), elseEvaluated, null)
                    : VoidLiteral.Singleton;

            return new IfElseStatement(conditionEvaluated, thenEvaluated, elseEvaluated);
        }

        return conditionLiteral.Value switch
        {
            true => await ThenStatement.EvaluateAsync(context),
            false when ElseStatement != null => await ElseStatement.EvaluateAsync(context),
            _ => VoidLiteral.Singleton,
        };
    }

    private static IExpressionTree? LiteralToNull(IExpressionTree statement)
        => statement is Literal ? null : statement;

    public override string SerializeToClient()
        => "if(" + Condition.SerializeToClient() + ")"
           + "{" + ThenStatement.SerializeToClient() + "}"
           + (ElseStatement != null ? "else{" + ElseStatement.SerializeToClient() + "}" : null);

    public override string ToString()
        => IfElseStatementRule.ToString(this);

    public override bool Equals(IfElseStatement? other)
        => other?.Condition.Equals(Condition) is true
           && other.ThenStatement.Equals(ThenStatement)
           && Equals(other.ElseStatement, ElseStatement);

    public override int GetHashCode()
        => HashCode.Combine(Condition, ThenStatement, ElseStatement);
}
