using Newtonsoft.Json;

namespace Frontend.Vanilla.Features.Json;

/// <summary>
/// Vanilla will use this class to initialize <see cref="JsonSerializerSettings"/> for use in WebApi
/// and Html.
/// </summary>
public interface IJsonSerializerSettingsConfigurator
{
    /// <summary>
    /// Initializes <see cref="JsonSerializerSettings"/>.
    /// </summary>
    void Configure(JsonSerializerSettings serializerSettings);
}
