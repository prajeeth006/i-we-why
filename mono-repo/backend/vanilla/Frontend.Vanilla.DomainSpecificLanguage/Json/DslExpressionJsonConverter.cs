using System;
using Frontend.Vanilla.Core.Utils;
using Newtonsoft.Json;

namespace Frontend.Vanilla.DomainSpecificLanguage.Json;

/// <summary>
/// Converts a string to <see cref="IDslExpression{T}" />.
/// It's used for deserialization of configuration instances from DynaCon.
/// </summary>
internal sealed class DslExpressionJsonConverter(Func<IDslCompiler> dslCompilerFactory) : DslExpressionJsonConverterBase
{
    private readonly Lazy<IDslCompiler> dslCompiler = dslCompilerFactory.ToLazy();

    // Lazy b/c compiler -> providers -> configs -> config engine -> this
    public override IDslExpression<T> Read<T>(object value)
    {
        if (!(value is string str))
            throw new Exception($"DSL expression must a be non-white-space string but the value {value.Dump()} is of type {value.GetType()}.");

        var (expression, _) = dslCompiler.Value.Compile<T>(str); // TODO handle warnings

        return expression;
    }

    public override void Write<T>(JsonWriter writer, IDslExpression<T> expr)
        => writer.WriteValue(expr.OriginalString);
}
