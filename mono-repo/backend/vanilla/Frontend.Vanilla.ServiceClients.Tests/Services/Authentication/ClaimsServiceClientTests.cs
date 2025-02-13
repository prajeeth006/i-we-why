using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Claims;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Security.Claims;
using Frontend.Vanilla.ServiceClients.Services.Authentication;
using Frontend.Vanilla.ServiceClients.Services.Authentication.ValidateTokens;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Moq;
using Moq;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Authentication;

public class ClaimsServiceClientTests
{
    private IClaimsServiceClient target;
    private Mock<IClaimsCache> claimsCache;
    private Mock<IPosApiClaimsServiceClient> posApiClaimsServiceClient;
    private Mock<IClaimsUserManager> claimsUserManager;
    private Mock<IValidateTokensServiceClient> validateTokensServiceClient;

    private IReadOnlyList<Claim> testClaims;
    private ExecutionMode mode;

    public ClaimsServiceClientTests()
    {
        claimsCache = new Mock<IClaimsCache>();
        posApiClaimsServiceClient = new Mock<IPosApiClaimsServiceClient>();
        claimsUserManager = new Mock<IClaimsUserManager>();
        validateTokensServiceClient = new Mock<IValidateTokensServiceClient>();
        target = new ClaimsServiceClient(claimsCache.Object, posApiClaimsServiceClient.Object, claimsUserManager.Object, validateTokensServiceClient.Object);

        testClaims = new[] { new Claim("Cached 1", "Value 1"), new Claim("Cached 2", "Value 2") };
        mode = TestExecutionMode.Get();
    }

    public static readonly IEnumerable<object[]> AuthTokenTestCases = new[]
    {
        new object[] { null, "anonymous" },
        new object[] { new PosApiAuthTokens("ut", "st"), "UserToken='ut', SessionToken='st'" },
    };

    public static readonly IEnumerable<object[]> AuthTokenWithFlagTestCases = AuthTokenTestCases
        .SelectMany(tc => new[] { true, false }.Select(f => new object[] { tc[0], f }));

    [Theory, MemberData(nameof(AuthTokenWithFlagTestCases))]
    internal async Task SetupUserAsync_ShouldLoadClaimsFromCache(PosApiAuthTokens authTokens, bool validateAuthOnPosApi)
    {
        claimsCache.SetupWithAnyArgs(c => c.GetAsync(default, null)).ReturnsAsync(testClaims);

        // Act
        await RunSetupUser(authTokens, validateAuthOnPosApi);

        claimsCache.Verify(c => c.GetAsync(mode, authTokens));
        claimsUserManager.Verify(m => m.SetCurrentAsync(mode, testClaims, false));
        posApiClaimsServiceClient.VerifyWithAnyArgs(c => c.GetAsync(default, null, default), Times.Never);

        var validateCount = authTokens != null && validateAuthOnPosApi ? 1 : 0;
        validateTokensServiceClient.Verify(c => c.ValidateAsync(mode, authTokens), Times.Exactly(validateCount));
        validateTokensServiceClient.Invocations.Should().HaveCount(validateCount);
    }

    [Theory, MemberData(nameof(AuthTokenWithFlagTestCases))]
    internal async Task SetupUserAsync_ShouldLoadClaimsFromPosApi_IfNothingInCache(PosApiAuthTokens authTokens, bool validateAuthOnPosApi)
    {
        posApiClaimsServiceClient.SetupWithAnyArgs(c => c.GetAsync(default, null, default)).ReturnsAsync(testClaims);

        // Act
        await RunSetupUser(authTokens, validateAuthOnPosApi);

        claimsCache.Verify(c => c.GetAsync(mode, authTokens));
        posApiClaimsServiceClient.Verify(c => c.GetAsync(mode, authTokens, true));
        claimsUserManager.Verify(m => m.SetCurrentAsync(mode, testClaims, true));
        validateTokensServiceClient.VerifyWithAnyArgs(c => c.ValidateAsync(default, null), Times.Never);
    }

    [Theory, MemberData(nameof(AuthTokenTestCases))]
    internal async Task SetupUserAsync_ShouldWrapException(PosApiAuthTokens authTokens, string reportedTokens)
    {
        var ex = new Exception("Error.");
        posApiClaimsServiceClient.SetupWithAnyArgs(c => c.GetAsync(default, null, default)).ThrowsAsync(ex);

        var act = () => RunSetupUser(authTokens);

        (await act.Should().ThrowAsync<PosApiException>())
            .WithMessage($"Failed setting up claims for user {reportedTokens}.")
            .Which.InnerException.Should().BeSameAs(ex);
    }

    private Task RunSetupUser(PosApiAuthTokens authTokens, bool validateAuthOnPosApi = false)
        => authTokens != null
            ? target.SetupUserAsync(mode, authTokens, validateAuthOnPosApi)
            : target.SetupAnonymousUserAsync(mode);

    [Theory, MemberData(nameof(AuthTokenTestCases))]
    internal async Task ReloadAsync_ShouldLoadClaimsFromPosApi_IfNothingInCache(PosApiAuthTokens authTokens, string dummy)
    {
        var dummy2 = dummy;
        SetupUser(authTokens);
        posApiClaimsServiceClient.SetupWithAnyArgs(c => c.GetAsync(default, null, default)).ReturnsAsync(testClaims);

        // Act
        await target.ReloadAsync(mode);

        posApiClaimsServiceClient.Verify(c => c.GetAsync(mode, authTokens, false));
        claimsUserManager.Verify(m => m.SetCurrentAsync(mode, testClaims, true));
    }

    [Theory, MemberData(nameof(AuthTokenTestCases))]
    internal async Task ReloadAsync_ShouldWrapException(PosApiAuthTokens authTokens, string reportedTokens)
    {
        SetupUser(authTokens);
        var ex = new Exception("Error.");
        posApiClaimsServiceClient.SetupWithAnyArgs(c => c.GetAsync(default, null, default)).ThrowsAsync(ex);

        var act = async () => await target.ReloadAsync(mode);

        (await act.Should().ThrowAsync<PosApiException>())
            .WithMessage($"Failed reloading claims for user {reportedTokens}.")
            .Which.InnerException.Should().BeSameAs(ex);
    }

    private void SetupUser(PosApiAuthTokens authTokens)
        => claimsUserManager.SetupGet(m => m.Current).Returns(new ClaimsPrincipal(new ClaimsIdentity(authTokens != null
            ? new[] { new Claim(PosApiClaimTypes.UserToken, authTokens.UserToken), new Claim(PosApiClaimTypes.SessionToken, authTokens.SessionToken) }
            : Array.Empty<Claim>())));
}
