using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.Patterns;
using Frontend.Vanilla.Core.Validation;
using Newtonsoft.Json.Linq;

namespace Frontend.Vanilla.Configuration.DynaCon.Deserialization.C_Instance;

/// <summary>
/// Executes data annotation validation of the config instance after it's deserialized.
/// If config is disabled, validation is skipped.
/// </summary>
internal sealed class ResultValidationDecorator(IInstanceDeserializer inner) : IInstanceDeserializer
{
    public WithWarnings<object> Deserialize(IConfigurationInfo info, JObject json)
    {
        var innerResult = inner.Deserialize(info, json);
        var config = innerResult.Value;

        if (config is IDisableableConfiguration disableable && !disableable.IsEnabled)
            return innerResult;

        var errors = ObjectValidator.GetErrors(config);

        return errors.Count == 0
            ? innerResult
            : throw new InvalidConfigurationException(errors);
    }
}
