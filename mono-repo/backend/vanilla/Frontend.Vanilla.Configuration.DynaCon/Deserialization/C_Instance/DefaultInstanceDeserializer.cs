using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.Patterns;
using Frontend.Vanilla.Core.System;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Frontend.Vanilla.Configuration.DynaCon.Deserialization.C_Instance;

/// <summary>
/// Main implementation of <see cref="IInstanceDeserializer" />.
/// </summary>
internal sealed class DefaultInstanceDeserializer : IInstanceDeserializer
{
    private readonly JsonSerializer serializer;

    public DefaultInstanceDeserializer(IEnumerable<ConfigurationInstanceJsonConverter> converters)
        => serializer = JsonSerializer.CreateDefault(new JsonSerializerSettings
        {
            Converters = { converters.Select(c => c.Converter) },
            CheckAdditionalContent = true,
        });

    public WithWarnings<object> Deserialize(IConfigurationInfo info, JObject json)
    {
        try
        {
            var config = json.ToObject(info.ImplementationType, serializer)!; // TODO not sure if ! is safe option here.

            return info.CreateUsingFactory(config);
        }
        catch (ArgumentException ex)
        {
            // Considered as invalid config value from DynaCon -> transformed accordingly
            throw new InvalidConfigurationException(new ValidationResult(ex.GetMessageIncludingInner(), new[] { ex.ParamName ?? string.Empty }));
        }
    }
}
