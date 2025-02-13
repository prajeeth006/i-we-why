using Frontend.Vanilla.Core.Patterns;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.DomainSpecificLanguage.Compilation;

internal abstract class DslCompilerBase : IDslCompiler
{
    WithWarnings<IDslAction> IDslCompiler.CompileAction(RequiredString actionString)
    {
        Guard.NotNull(actionString, nameof(actionString));

        var (expression, warnings) = Compile<VoidDslResult>(actionString);

        return new DslAction(expression).WithWarnings<IDslAction>(warnings);
    }

    public abstract WithWarnings<IDslExpression<T>> Compile<T>(RequiredString expressionString)
        where T : notnull;
}
