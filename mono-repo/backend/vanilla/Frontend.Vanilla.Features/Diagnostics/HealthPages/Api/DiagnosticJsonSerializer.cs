using System.IO;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Core.Json.Converters;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Linq;

namespace Frontend.Vanilla.Features.Diagnostics.HealthPages.Api;

internal static class DiagnosticJsonSerializer
{
    private static readonly JsonSerializer JsonSerializer = JsonSerializer.Create(new JsonSerializerSettings
    {
        Converters =
        {
            new SimpleClrTypeJsonConverter(),
            new SimpleExceptionConverter(),
            new StringEnumConverter(),
            new IsoDateTimeConverter(),
            new IpAddressStringJsonConverter(),
            new DocumentId.ToStringJsonConverter(),
        },
    });

    public static JToken ToDiagnosticJson(this object value)
        => JToken.FromObject(value, JsonSerializer);

    public static JObject ToDiagnosticJsonObject(this object value)
        => JObject.FromObject(value, JsonSerializer);

    public static byte[] ToBytes(object value)
    {
        var memory = new MemoryStream(); // No Dispose() b/c managed memory collected when needed
        using (var writer = new StreamWriter(memory))
            JsonSerializer.Serialize(writer, value);

        return memory.ToArray();
    }
}
