#nullable disable
using System;
using System.Linq;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.ServiceClients.Claims;
using Frontend.Vanilla.ServiceClients.Services.Common.Countries;

namespace Frontend.Vanilla.Features.DslProviders;

/// <summary>
/// Implementation of <see cref="IGeoIPDslProvider" /> for ASP.NET 4 apps.
/// </summary>
internal sealed class GeoIpDslProvider(IClaimsDslProvider claimsDslProvider, Func<ICountriesServiceClient> linkCountriesServiceClient)
    : IGeoIPDslProvider
{
    private readonly Lazy<ICountriesServiceClient> lazyCountriesServiceClient = linkCountriesServiceClient.ToLazy();

    public string GetCountry()
        => claimsDslProvider.Get(PosApiClaimTypes.GeoIP.CountryId);

    public string GetCountryName()
    {
        var countryCode = GetCountry();

        return ExecutionMode.ExecuteSync(lazyCountriesServiceClient.Value.GetAllAsync, false).FirstOrDefault(c => c.Id == countryCode)?.Name;
    }

    public string GetCity()
        => claimsDslProvider.Get(PosApiClaimTypes.GeoIP.City);

    public string GetRegion()
        => claimsDslProvider.Get(PosApiClaimTypes.GeoIP.Region);
}
