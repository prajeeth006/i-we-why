using System.Collections.Generic;
using Newtonsoft.Json;

namespace Frontend.Vanilla.Features.Json;

/// <summary>
/// Factory for creating JSON serializer with custom settings and serializers.
/// </summary>
public interface IJsonSerializerFactory
{
    /// <summary>
    /// Creates a json serializer.
    /// </summary>
    JsonSerializer CreateSerializer();
}

internal sealed class JsonSerializerFactory(IEnumerable<IJsonSerializerSettingsConfigurator> configurators) : IJsonSerializerFactory
{
    public JsonSerializer CreateSerializer()
    {
        var settings = new JsonSerializerSettings();
        ConfigureSettings(settings);

        return JsonSerializer.Create(settings);
    }

    private void ConfigureSettings(JsonSerializerSettings settings)
    {
        foreach (var configurator in configurators)
        {
            configurator.Configure(settings);
        }
    }
}
