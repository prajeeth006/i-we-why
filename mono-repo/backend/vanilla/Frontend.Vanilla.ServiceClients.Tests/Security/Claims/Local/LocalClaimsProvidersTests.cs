using System;
using FluentAssertions;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.ServiceClients.Security.Claims;
using Frontend.Vanilla.ServiceClients.Security.Claims.Local;
using Frontend.Vanilla.Testing.FluentAssertions;
using Moq;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Security.Claims.Local;

public class LocalClaimsProvidersTests
{
    private Mock<ILocalClaimsProvider> provider1;
    private Mock<ILocalClaimsProvider> provider2;
    private Mock<IGlobalClaimInfos> globalClaimInfos;

    public LocalClaimsProvidersTests()
    {
        provider1 = new Mock<ILocalClaimsProvider>();
        provider1.SetupGet(p => p.Issuer).Returns("Issuer 1");
        provider1.SetupGet(p => p.DeclaredClaims).Returns(
            new[]
            {
                new LocalClaimInfo("Claim 1.1", "Desc"),
                new LocalClaimInfo("Claim 1.2", "Desc"),
            });

        provider2 = new Mock<ILocalClaimsProvider>();
        provider2.SetupGet(p => p.Issuer).Returns("Issuer 2");
        provider2.SetupGet(p => p.DeclaredClaims).Returns(
            new[]
            {
                new LocalClaimInfo("Claim 2", "Desc"),
            });

        globalClaimInfos = new Mock<IGlobalClaimInfos>();
        globalClaimInfos.SetupGet(g => g.Infos).Returns(
            new[]
            {
                new ClaimInfo("Vanilla", "Vanilla Claim", "Desc"),
            });
    }

    private Func<ILocalClaimsProviders> Act =>
        () => new LocalClaimsProviders(new[] { provider1.Object, provider2.Object }, globalClaimInfos.Object);

    [Fact]
    public void ShouldExposeAllProviders()
    {
        var target = Act();
        target.Providers.Should().Equal(provider1.Object, provider2.Object);
    }

    [Fact]
    public void ShouldThrow_IfDuplicateIssuer()
    {
        provider2.SetupGet(p => p.Issuer).Returns("Issuer 1");
        Act.Should().Throw<DuplicateException>().Which.ConflictingValue.Should().Be("Issuer 1");
    }

    [Fact]
    public void ShouldThrow_IfClaimTypesConflictingBetweenProviders()
    {
        provider1.SetupGet(p => p.DeclaredClaims).Returns(provider2.Object.DeclaredClaims);
        Act.Should().Throw()
            .WithMessage(
                $"There can be only one source for a claim but 'Claim 2' is issued by: LocalClaimsProvider {provider1.Object} with Issuer 'Issuer 1' vs. LocalClaimsProvider {provider2.Object} with Issuer 'Issuer 2'.");
    }

    [Fact]
    public void ShouldThrow_IfClaimTypesConflictingWithGlobalOnes()
    {
        provider1.SetupGet(p => p.DeclaredClaims).Returns(new[] { new LocalClaimInfo("Vanilla Claim", "Desc") });
        Act.Should().Throw()
            .WithMessage(
                $"There can be only one source for a claim but 'Vanilla Claim' is issued by: LocalClaimsProvider {provider1.Object} with Issuer 'Issuer 1' vs. global issuer 'Vanilla'.");
    }
}
