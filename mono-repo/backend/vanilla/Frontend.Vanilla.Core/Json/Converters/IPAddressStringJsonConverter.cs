using System;
using System.Net;
using Frontend.Vanilla.Core.Json.Converters.Abstract;
using Newtonsoft.Json;

namespace Frontend.Vanilla.Core.Json.Converters;

internal sealed class IpAddressStringJsonConverter : JsonConverterBase<IPAddress>
{
    public override IPAddress Read(JsonReader reader, Type typeToRead, JsonSerializer serializer)
    {
        if (typeToRead != typeof(IPAddress))
            throw new InvalidOperationException($"{GetType()} can deserialize only {typeof(IPAddress)} but {typeToRead} is requested.");

        return IPAddress.Parse(reader.GetRequiredValue<string>());
    }

    public override void Write(JsonWriter writer, IPAddress value, JsonSerializer serializer)
        => writer.WriteValue(value.ToString());
}
