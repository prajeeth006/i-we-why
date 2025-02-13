using System.Collections.Generic;
using System.Linq;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Utils;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace Frontend.Vanilla.Features.Json;

/// <summary>
/// Default Vanilla configuration of settings for JSON serializer.
/// </summary>
internal sealed class VanillaJsonSerializerSettingsConfigurator(IEnumerable<JsonConverter> converters) : IJsonSerializerSettingsConfigurator
{
    private readonly IReadOnlyList<JsonConverter> converters = Guard.NotNull(converters, nameof(converters)).ToArray();

    public void Configure(JsonSerializerSettings serializerSettings)
    {
        serializerSettings.Converters.Add(converters);
        serializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
        serializerSettings.DateTimeZoneHandling = DateTimeZoneHandling.Utc;
        serializerSettings.NullValueHandling = NullValueHandling.Ignore;
    }
}
