using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.ServiceClients.Services;

namespace Frontend.Vanilla.Features.DslProviders;

internal sealed class PostLoginValuesDslProvider(IClaimsService claimsService) : IPostLoginValuesDslProvider
{
    public bool ShowKycDe
    {
        get
        {
            var values = claimsService.GetPostLoginValues();

            return values != null && values.TryGetValue("ShowKycDe", out var value) && bool.Parse(value.ToString()!);
        }
    }

    public bool ShowMcUpgrade
    {
        get
        {
            var values = claimsService.GetPostLoginValues();

            return values != null && values.TryGetValue("ShowMcUpgrade", out var value) && bool.Parse(value.ToString()!);
        }
    }
}
