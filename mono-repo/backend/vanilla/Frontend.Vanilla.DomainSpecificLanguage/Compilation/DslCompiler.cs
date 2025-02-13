using Frontend.Vanilla.Core.Diagnostics;
using Frontend.Vanilla.Core.Patterns;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree;
using Frontend.Vanilla.DomainSpecificLanguage.Parsing;

namespace Frontend.Vanilla.DomainSpecificLanguage.Compilation;

internal sealed class DslCompiler(IExpressionTreeParser parser, ITraceRecorder traceRecorder) : DslCompilerBase
{
    public override WithWarnings<IDslExpression<T>> Compile<T>(RequiredString expressionString)
    {
        Guard.NotNull(expressionString, nameof(expressionString));

        var (parsedExpression, warnings) = parser.Parse(expressionString, typeof(T));
        var context = new EvaluationContext(ExecutionMode.Sync, DslEvaluation.Optimization, trace: null);
        var optimizedExpression = ExecutionMode.ExecuteSync(parsedExpression.EvaluateAsync(context));

        var result = new DslExpression<T>(expressionString, optimizedExpression, traceRecorder);

        return result.WithWarnings<IDslExpression<T>>(warnings);
    }
}
