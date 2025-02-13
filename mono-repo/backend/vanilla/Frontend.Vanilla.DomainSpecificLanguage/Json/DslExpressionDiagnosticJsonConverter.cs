using System;
using Frontend.Vanilla.Core.Json;
using Newtonsoft.Json;

namespace Frontend.Vanilla.DomainSpecificLanguage.Json;

/// <summary>
/// Converts <see cref="IDslExpression{TResult}" /> to diagnostic info to be used on respective page.
/// </summary>
internal sealed class DslExpressionDiagnosticJsonConverter : DslExpressionJsonConverterBase
{
    public override void Write<T>(JsonWriter writer, IDslExpression<T> expression)
    {
        writer.WriteStartObject();
        writer.WriteProperty("OriginalExpression", expression.OriginalString.Value);
        writer.WriteProperty("ActualOptimizedExpression", expression.ToString());
        writer.WriteProperty("ResultType", typeof(T).ToString());
        writer.WriteEndObject();
    }

    public override bool CanRead => false;
    public override IDslExpression<T> Read<T>(object value) => throw new NotSupportedException();
}
