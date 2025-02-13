using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.ServiceClients.Claims;

namespace Frontend.Vanilla.Features.DynaConVariationContext.Providers;

/// <summary>
/// Provides user's jurisdiction for config variation context.
/// </summary>
internal sealed class JurisdictionDynaConProvider(IClaimsDslProvider claimsDslProvider) : IWebDynaConVariationContextProvider
{
    public TrimmedRequiredString Name { get; } = "Jurisdiction";
    public TrimmedRequiredString DefaultValue { get; } = "ROW";

    public string GetCurrentRawValue()
    {
        var jurisdictionId = claimsDslProvider.Get(PosApiClaimTypes.JurisdictionId);

        return string.IsNullOrEmpty(jurisdictionId) ? DefaultValue : jurisdictionId;
    }
}
