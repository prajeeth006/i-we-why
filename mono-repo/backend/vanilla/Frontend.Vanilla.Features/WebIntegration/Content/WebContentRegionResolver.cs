using System.Globalization;
using Frontend.Vanilla.Content.Client.Infrastructure;
using Frontend.Vanilla.ServiceClients.Claims;
using Frontend.Vanilla.ServiceClients.Security;

namespace Frontend.Vanilla.Features.WebIntegration.Content;

internal sealed class WebContentRegionResolver(ICurrentUserAccessor currentUserAccessor) : IContentRegionResolver
{
    public string? GetUserCountryCode()
        => currentUserAccessor.User.FindValue(PosApiClaimTypes.Address.CountryId);

    public string GetCurrentLanguageCode()
        => CultureInfo.CurrentCulture.TwoLetterISOLanguageName;
}
