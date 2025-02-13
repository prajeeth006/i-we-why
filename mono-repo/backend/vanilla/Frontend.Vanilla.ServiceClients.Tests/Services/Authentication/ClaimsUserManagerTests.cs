using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Claims;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Security.Claims;
using Frontend.Vanilla.ServiceClients.Security.Claims.Local;
using Frontend.Vanilla.ServiceClients.Services.Authentication;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Moq;
using Moq;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Authentication;

public class ClaimsUserManagerTests
{
    private IClaimsUserManager target;
    private ICurrentUserAccessor currentUserAccessor;
    private Mock<IClaimsUserFactory> claimsUserFactory;
    private Mock<ILocalClaimsResolver> localClaimsResolver;
    private Mock<IClaimsCache> claimsCache;
    private List<Claim> existingClaims;
    private List<Claim> localClaims;
    private IEnumerable<Claim> allClaims;
    private ClaimsPrincipal createdUser;
    private ExecutionMode mode;

    public ClaimsUserManagerTests()
    {
        currentUserAccessor = Mock.Of<ICurrentUserAccessor>();
        claimsUserFactory = new Mock<IClaimsUserFactory>();
        localClaimsResolver = new Mock<ILocalClaimsResolver>();
        claimsCache = new Mock<IClaimsCache>();
        target = new ClaimsUserManager(currentUserAccessor, claimsUserFactory.Object, localClaimsResolver.Object, claimsCache.Object);

        mode = TestExecutionMode.Get();
        existingClaims = new List<Claim>
        {
            new Claim(PosApiClaimTypes.Name, "Chuck Norris"),
            new Claim(PosApiClaimTypes.CurrencyId, "Gold"),
        };
        localClaims = new List<Claim>
        {
            new Claim(PosApiClaimTypes.GeoIP.CountryId, "Rohan"),
            new Claim(PosApiClaimTypes.GeoIP.Region, "Helm's Deep"),
        };
        allClaims = existingClaims.Concat(localClaims);
        createdUser = new ClaimsPrincipal(new ClaimsIdentity());

        // localClaimsResolver.SetupWithAnyArgs(r => r.ResolveAsync(null, mode.AsyncCancellationToken.GetValueOrDefault())).Returns(Task.FromResult(localClaims.ToArray().rea));
        claimsUserFactory.SetupWithAnyArgs(f => f.Create(null)).Returns(createdUser);
        localClaimsResolver.Setup(x => x.ResolveAsync(existingClaims, mode)).Returns(Task.FromResult((IReadOnlyList<Claim>)localClaims));
    }

    [Fact]
    public void ShouldExposeInnerUser()
    {
        var user = currentUserAccessor.User = new ClaimsPrincipal();
        target.Current.Should().BeSameAs(user); // Act
    }

    [Fact]
    public async Task ShouldSetUser()
    {
        var result = await target.SetCurrentAsync(mode, existingClaims, writeClaimsToCache: true); // Act

        result.Should().BeSameAs(createdUser);
        localClaimsResolver.Verify(r => r.ResolveAsync(existingClaims, mode));
        claimsUserFactory.Verify(f => f.Create(allClaims));
        currentUserAccessor.User.Should().BeSameAs(createdUser);
        claimsCache.Verify(c => c.SetAsync(mode, allClaims));
    }

    [Theory]
    [InlineData(false, false)]
    [InlineData(false, true)]
    [InlineData(true, false)]
    [InlineData(true, true)]
    public async Task ShouldWriteClaimsToCache_IfExplicitParameter_OrNewLocalClaims(bool hasLocalClaims, bool writeClaimsToCache)
    {
        if (!hasLocalClaims) localClaims.Clear();

        await target.SetCurrentAsync(mode, existingClaims, writeClaimsToCache); // Act

        var times = Times.Exactly(hasLocalClaims || writeClaimsToCache ? 1 : 0);
        claimsCache.Verify(c => c.SetAsync(mode, allClaims), times);
        claimsCache.VerifyWithAnyArgs(c => c.SetAsync(default, null), times);
    }
}
