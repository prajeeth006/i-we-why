using Frontend.Vanilla.Core.Validation;
using Newtonsoft.Json;

namespace Frontend.Vanilla.Core.Configuration;

/// <summary>
/// Main abstract entry point for providing configuration objects.
/// </summary>
internal interface IConfigurationEngine
{
    object CreateConfiguration(IConfigurationInfo configInfo);
}

/// <summary>
/// Marker for JSON converter used when deserializing a configuration instance.
/// </summary>
internal sealed class ConfigurationInstanceJsonConverter(JsonConverter converter)
{
    public JsonConverter Converter { get; } = converter;
}

/// <summary>
/// Builds configuration of given type usually according to previously specified parameters (via methods or property setters).
/// </summary>
internal interface IConfigurationBuilder<TConfiguration>
    where TConfiguration : class
{
    TConfiguration Build();
}

internal static class ConfigurationBuilderExtensions
{
    public static void Validate<TConfiguration>(this IConfigurationBuilder<TConfiguration> builder)
        where TConfiguration : class
    {
        var errors = ObjectValidator.GetErrors(builder);

        if (errors.Count > 0)
            throw new InvalidConfigurationException(errors);
    }
}
