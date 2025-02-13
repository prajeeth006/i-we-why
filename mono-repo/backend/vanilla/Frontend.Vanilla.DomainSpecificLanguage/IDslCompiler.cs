using Frontend.Vanilla.Core.Patterns;
using Frontend.Vanilla.Core.System.Text;

namespace Frontend.Vanilla.DomainSpecificLanguage;

/// <summary>
/// Central class for creation (compilation) of <see cref="IDslExpression{TResult}" />.
/// </summary>
public interface IDslCompiler
{
    /// <summary>Compiles raw string DSL expression to <see cref="IDslExpression{TResult}" />.</summary>
    WithWarnings<IDslExpression<T>> Compile<T>(RequiredString expressionString)
        where T : notnull;

    /// <summary>Compiles raw string DSL code to <see cref="IDslAction" />.</summary>
    WithWarnings<IDslAction> CompileAction(RequiredString actionString);
}
