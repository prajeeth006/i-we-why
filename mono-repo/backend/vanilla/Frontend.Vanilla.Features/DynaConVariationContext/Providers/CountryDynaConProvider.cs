using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.ServiceClients.Claims;

namespace Frontend.Vanilla.Features.DynaConVariationContext.Providers;

/// <summary>
/// Provides country based on Geo IP claims for config variation context.
/// </summary>
internal sealed class CountryDynaConProvider(IClaimsDslProvider claimsDslProvider) : IWebDynaConVariationContextProvider
{
    public TrimmedRequiredString Name { get; } = "Country";
    public TrimmedRequiredString DefaultValue { get; } = "unknown";

    public string GetCurrentRawValue()
    {
        var country = claimsDslProvider.Get(PosApiClaimTypes.GeoIP.CountryId);

        return string.IsNullOrEmpty(country) ? DefaultValue : country;
    }
}
