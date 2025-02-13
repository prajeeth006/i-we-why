using System;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.Patterns;
using Newtonsoft.Json.Linq;

namespace Frontend.Vanilla.Configuration.DynaCon.Deserialization.C_Instance;

/// <summary>
/// Deserializes single configuration instance from given JSON for the feature.
/// </summary>
internal interface IInstanceDeserializer
{
    /// <exception cref="InvalidConfigurationException">If config values from DynaCon are invalid.</exception>
    /// <exception cref="Exception">Unexpected errors.</exception>
    WithWarnings<object> Deserialize(IConfigurationInfo info, JObject json);
}
