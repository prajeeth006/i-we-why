using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.DomainSpecificLanguage.Parsing.Syntactical.Rules;
using HashCode = Frontend.Vanilla.Core.System.HashCode;

namespace Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree.Statements;

/// <summary>
/// Defines a block of consecutive void expressions.
/// </summary>
internal sealed class StatementBlock : ExpressionTreeBase<StatementBlock>
{
    public override DslType ResultType => DslType.Void;
    public IReadOnlyList<IExpressionTree> Statements { get; }

    public StatementBlock(IEnumerable<IExpressionTree> statements)
        => Statements = statements.Select(s => s.GuardResultType(DslType.Void, nameof(statements))).ToArray();

    public override IEnumerable<IExpressionTree> GetChildren()
        => Statements;

    public override async Task<IExpressionTree> EvaluateAsync(EvaluationContext context)
    {
        // Don't execute in parallel b/c order matters, statements can consider previous state changes
        var remainingStatements = new List<IExpressionTree>();

        foreach (var statement in Statements)
        {
            var statementResult = await statement.EvaluateAsync(context);
            if (!(statementResult is Literal))
                remainingStatements.Add(statementResult);
        }

        return remainingStatements.Count switch
        {
            0 => VoidLiteral.Singleton,
            1 => remainingStatements[0],
            _ => new StatementBlock(remainingStatements),
        };
    }

    public override string SerializeToClient()
        => Statements.Select(s => s.SerializeToClient()).Concat();

    public override string ToString()
        => StatementBlockRule.ToString(this);

    public override bool Equals(StatementBlock? other)
        => other?.Statements.SequenceEqual(Statements) is true;

    public override int GetHashCode()
        => HashCode.Combine(Statements);
}
