using Frontend.Vanilla.Core.Diagnostics;
using Frontend.Vanilla.Core.Patterns;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.DomainSpecificLanguage.Compilation;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tracing;

/// <summary>
/// Decorates DSL expression with <see cref="TracedDslExpression{T}" />.
/// </summary>
internal sealed class TracedDslCompiler(IDslCompiler inner, ITraceRecorder traceRecorder) : DslCompilerBase
{
    public override WithWarnings<IDslExpression<T>> Compile<T>(RequiredString expression)
    {
        var (result, warnings) = inner.Compile<T>(expression);
        var tracedExpression = new TracedDslExpression<T>(result, traceRecorder);

        return tracedExpression.WithWarnings<IDslExpression<T>>(warnings);
    }
}
