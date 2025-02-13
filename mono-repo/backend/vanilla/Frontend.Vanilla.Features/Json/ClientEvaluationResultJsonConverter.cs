using Frontend.Vanilla.Core.Json.Converters.Abstract;
using Frontend.Vanilla.DomainSpecificLanguage;
using Newtonsoft.Json;

namespace Frontend.Vanilla.Features.Json;

/// <summary>
/// Converts <see cref="ClientEvaluationResult{T}"/> to JSON for the client.
/// </summary>
internal sealed class ClientEvaluationResultJsonConverter : JsonWriteConverter<IClientEvaluationResult>
{
    public override void Write(JsonWriter writer, IClientEvaluationResult dslResult, JsonSerializer serializer)
    {
        var json = !dslResult.HasFinalValue
            ? dslResult.ClientExpression
            : JsonConvert.ToString(dslResult.Value);

        writer.WriteValue(json);
    }
}
