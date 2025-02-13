using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Security.Claims.Local;
using Frontend.Vanilla.ServiceClients.Services.Authentication;
using Frontend.Vanilla.Testing.Moq;
using Moq;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Security.Claims.Local;

public class LocalClaimsResolverTests
{
    private ILocalClaimsResolver target;
    private Mock<ILocalClaimsProviders> providers;
    private Mock<ICurrentUserAccessor> currentUserAccessor;
    private Mock<IClaimsUserFactory> claimsUserFactory;

    private Mock<ILocalClaimsProvider> provider1;
    private Mock<ILocalClaimsProvider> provider2;
    private IReadOnlyList<Claim> provider1Claims;
    private IReadOnlyList<Claim> provider2Claims;
    private List<Claim> existingClaims;
    private ClaimsPrincipal createdUser;
    private ExecutionMode mode;

    public LocalClaimsResolverTests()
    {
        providers = new Mock<ILocalClaimsProviders>();
        currentUserAccessor = new Mock<ICurrentUserAccessor>();
        claimsUserFactory = new Mock<IClaimsUserFactory>();
        target = new LocalClaimsResolver(providers.Object, currentUserAccessor.Object, claimsUserFactory.Object);

        provider1 = new Mock<ILocalClaimsProvider>();
        provider2 = new Mock<ILocalClaimsProvider>();

        mode = ExecutionMode.Async(new CancellationTokenSource().Token);

        existingClaims = new List<Claim> { new Claim("Existing", "Existing Value") };
        provider1Claims = new[] { new Claim("Claim 1.1", "Value 1.1"), new Claim("Claim 1.2", "Value 1.2") };
        provider2Claims = new[] { new Claim("Claim 2", "Value 2") };
        createdUser = new ClaimsPrincipal();

        provider1.SetupGet(p => p.Issuer).Returns("Issuer 1");
        provider2.SetupGet(p => p.Issuer).Returns("Issuer 2");
        provider1.Setup(p => p.GetClaimsAsync(mode)).Returns(Task.FromResult(provider1Claims));
        provider2.Setup(p => p.GetClaimsAsync(mode)).Returns(Task.FromResult(provider2Claims));
        providers.SetupGet(p => p.Providers).Returns(new[] { provider1.Object, provider2.Object });
        claimsUserFactory.SetupWithAnyArgs(f => f.Create(null)).Returns(createdUser);
    }

    [Fact]
    public async Task ShouldCollectClaimsFromAllProviders()
    {
        var claims = await target.ResolveAsync(existingClaims, mode); // Act

        claims.Should().Equal(provider1Claims.Concat(provider2Claims));
        claimsUserFactory.Verify(m => m.Create(existingClaims));
        currentUserAccessor.VerifySet(a => a.User = createdUser);
        currentUserAccessor.VerifySet(a => a.User = It.IsAny<ClaimsPrincipal>(), Times.Once);
    }

    [Fact]
    public async Task ShouldSkipAlreadyExecutedProviders()
    {
        existingClaims.Add(new Claim("Whatever Type", "Whatever Value", null, provider1.Object.Issuer));

        var claims = await target.ResolveAsync(existingClaims, mode); // Act

        claims.Should().Equal(provider2Claims);
    }

    [Fact]
    public async Task ShouldNotSetUser_IfNoProviders()
    {
        existingClaims.Add(new Claim("Whatever Type", "Whatever Value", null, provider1.Object.Issuer));
        existingClaims.Add(new Claim("Whatever Type", "Whatever Value", null, provider2.Object.Issuer));

        var claims = await target.ResolveAsync(existingClaims, mode); // Act

        claims.Should().BeEmpty();
        currentUserAccessor.VerifySet(a => a.User = It.IsAny<ClaimsPrincipal>(), Times.Never);
    }

    [Fact]
    public async Task ShouldSetTemporaryUserBeforeProvidersAreExecuted()
    {
        int counter = 1, setUserOrder = 0, provider1Order = 0, provider2Order = 0;
        currentUserAccessor.SetupSet(m => m.User = It.IsAny<ClaimsPrincipal>()).Callback(() => setUserOrder = counter++);
        provider1.Setup(p => p.GetClaimsAsync(mode)).Callback(() => provider1Order = counter++).Returns(Task.FromResult(provider1Claims));
        provider2.Setup(p => p.GetClaimsAsync(mode)).Callback(() => provider2Order = counter++).Returns(Task.FromResult(provider2Claims));

        await target.ResolveAsync(existingClaims, mode); // Act

        setUserOrder.Should().BeLessThan(provider1Order).And.BeLessThan(provider2Order);
    }

    [Fact]
    public void ShouldThrow_IfClaimAlreadyExists()
    {
        existingClaims.Add(new Claim("Claim 2", "Primary 2", null, "Primary Issuer"));

        Func<Task> act = async () => await target.ResolveAsync(existingClaims, mode);

        act.Should().ThrowAsync<Exception>().WithMessage(
            $"{nameof(LocalClaimsProvider)} {provider2.Object} with {nameof(LocalClaimsProvider.Issuer)} 'Issuer 2'"
            + " issued claim 'Claim 2' with value 'Value 2' which already exists with value 'Primary 2' issued by 'Primary Issuer'.");
    }
}
