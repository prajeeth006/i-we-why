using FluentAssertions;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.DynaConVariationContext.Providers;
using Frontend.Vanilla.ServiceClients.Claims;
using Frontend.Vanilla.Testing;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.DynaConVariationContext.Providers;

public class CountryDynaConProviderTests : DynaConProviderTestsBase
{
    private Mock<IClaimsDslProvider> claimsDslProvider;

    public CountryDynaConProviderTests()
    {
        claimsDslProvider = new Mock<IClaimsDslProvider>();
        Target = new CountryDynaConProvider(claimsDslProvider.Object);
    }

    [Fact]
    public void GetCurrentRawValue_ShouldGetGeoIPCountry()
    {
        claimsDslProvider.Setup(p => p.Get(PosApiClaimTypes.GeoIP.CountryId)).Returns("United Federation of Planets");
        Target.GetCurrentRawValue().Should().Be("United Federation of Planets");
    }
}
