using Frontend.Vanilla.Configuration.DynaCon.Context;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Utils;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace Frontend.Vanilla.Features.DynaConVariationContext;

/// <summary>
/// Executes common logic and parsing of DynaCon variation context value specific for web app.
/// </summary>
internal sealed class DynaConVariationContextProviderAdapter(
    IWebDynaConVariationContextProvider webProvider,
    IHttpContextAccessor httpContextAccessor,
    ILogger<DynaConVariationContextProviderAdapter> log)
    : IDynaConVariationContextProvider
{
    public TrimmedRequiredString Name => webProvider.Name;

    public TrimmedRequiredString GetCurrentValue(ReadOnlySet<TrimmedRequiredString> definedValues)
    {
        if (httpContextAccessor.HttpContext == null)
            return webProvider.DefaultValue;

        var rawValue = webProvider.GetCurrentRawValue();

        if (rawValue == null || string.IsNullOrWhiteSpace(rawValue))
        {
            log.LogError(
                "Configuration variation context property {name} resolved to null."
                + " This is unexpected result from corresponding provider. Make sure that its data source is operational."
                + " Using {defaultValue} instead so there is no customer impact",
                Name.Value,
                webProvider.DefaultValue.Value);

            return webProvider.DefaultValue;
        }

        var cleanedValue = new TrimmedRequiredString(rawValue.Trim());

        if (!definedValues.Contains(cleanedValue))
        {
            log.LogWarning(
                "Configuration variation context property {name} resolved to {value} which is not within {definedValues} in DynaCon."
                + " It may be needed in order to create config values for particular context. So add it in DynaCon admin web."
                + " Using {defaultValue} instead so there is no customer impact",
                Name.Value,
                cleanedValue.Value,
                definedValues.Dump(),
                webProvider.DefaultValue.Value);

            return webProvider.DefaultValue;
        }

        return cleanedValue;
    }
}
