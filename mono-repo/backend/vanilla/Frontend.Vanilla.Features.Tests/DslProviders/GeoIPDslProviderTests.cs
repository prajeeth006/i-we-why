using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.DslProviders;
using Frontend.Vanilla.ServiceClients.Claims;
using Frontend.Vanilla.ServiceClients.Services.Common.Countries;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.DslProviders;

public class GeoIPDslProviderTests
{
    [Fact]
    public void ShallGetValuesFromClaims()
    {
        var claimsDslProvider = new Mock<IClaimsDslProvider>();
        var countriesServiceClient = new Mock<ICountriesServiceClient>();
        var target = new GeoIpDslProvider(claimsDslProvider.Object, () => countriesServiceClient.Object);

        claimsDslProvider.Setup(p => p.Get(PosApiClaimTypes.GeoIP.CountryId)).Returns("AT");
        claimsDslProvider.Setup(p => p.Get(PosApiClaimTypes.GeoIP.City)).Returns("Vienna");
        claimsDslProvider.Setup(p => p.Get(PosApiClaimTypes.GeoIP.Region)).Returns("Tirol");
        countriesServiceClient.Setup(s => s.GetAllAsync(It.IsAny<ExecutionMode>())).ReturnsAsync(new List<Country>
        {
            new Country(id: "AT", name: "Austria"),
        });

        // Act & assert
        target.GetCountry().Should().Be("AT");
        target.GetCity().Should().Be("Vienna");
        target.GetRegion().Should().Be("Tirol");
        target.GetCountryName().Should().Be("Austria");
    }
}
