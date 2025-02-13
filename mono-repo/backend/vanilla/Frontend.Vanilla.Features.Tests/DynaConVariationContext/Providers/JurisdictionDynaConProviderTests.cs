using FluentAssertions;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.DynaConVariationContext.Providers;
using Frontend.Vanilla.ServiceClients.Claims;
using Frontend.Vanilla.Testing;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.DynaConVariationContext.Providers;

public class JurisdictionDynaConProviderTests : DynaConProviderTestsBase
{
    private readonly Mock<IClaimsDslProvider> claimsDslProvider;

    public JurisdictionDynaConProviderTests()
    {
        claimsDslProvider = new Mock<IClaimsDslProvider>();
        Target = new JurisdictionDynaConProvider(claimsDslProvider.Object);
    }

    [Fact]
    public void GetCurrentRawValue_ShouldGetDefaultValue()
    {
        Target.GetCurrentRawValue().Should().Be(Target.DefaultValue);
    }

    [Fact]
    public void GetCurrentRawValue_ShouldComeFromClaims()
    {
        claimsDslProvider.Setup(p => p.Get(PosApiClaimTypes.JurisdictionId)).Returns("Balkan");
        Target.GetCurrentRawValue().Should().Be("Balkan");
    }
}
