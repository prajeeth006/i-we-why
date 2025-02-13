using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.LoginDuration;
using Frontend.Vanilla.ServiceClients.Services.Authentication;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Moq;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Login;

public class LoginExpirationProviderTests
{
    private readonly ILoginExpirationProvider target;
    private readonly Mock<IPosApiAuthenticationServiceInternal> posApiAuthenticationService;
    private readonly TestClock clock;
    private readonly CancellationToken ct;

    public LoginExpirationProviderTests()
    {
        var contentService = new Mock<IContentService>();
        ct = TestCancellationToken.Get();
        contentService.Setup(s => s.GetRequiredStringAsync("App-v1.0", ItIs.Expression((IPluginRoot r) => r.Messages["LoginDuration"]), ct))
            .ReturnsAsync("LoginDuration: {duration}");

        posApiAuthenticationService = new Mock<IPosApiAuthenticationServiceInternal>();
        posApiAuthenticationService.Setup(s => s.GetCurrentSessionAsync(ct))
            .ReturnsAsync(new ServiceClients.Services.Authentication.CurrentSessions.CurrentSession(
                isAutomaticLogoutRequired: true,
                startTime: new UtcDateTime(2017, 4, 12, 13, 34, 59, 452),
                expirationTime: new UtcDateTime(2017, 4, 12, 15, 34, 59, 452)));

        clock = new TestClock { UtcNow = new UtcDateTime(2017, 4, 12, 14, 5, 6) };
        target = new LoginExpirationProvider(posApiAuthenticationService.Object, clock);
    }

    [Fact]
    public async Task ShouldReturnRemainingTimeForAuthenticatedUser()
    {
        var result = await target.GetRemainingTimeAndLoginDurationInMillisecondsAsync(ct);

        result.Should().Be((5393452L, 1806548L));
    }

    [Fact]
    public async Task ShouldReturnNullWhenFeatureDisabled()
    {
        posApiAuthenticationService.Setup(s => s.GetCurrentSessionAsync(ct))
            .ReturnsAsync(new ServiceClients.Services.Authentication.CurrentSessions.CurrentSession(startTime: new UtcDateTime(2017, 4, 12, 13, 34, 59, 452)));
        var result = await target.GetRemainingTimeAndLoginDurationInMillisecondsAsync(ct);

        result.Should().Be((null, 1806548L));
    }

    [Fact]
    public async Task ShouldSetDurationToZeroForNegativeDiff()
    {
        posApiAuthenticationService.Setup(s => s.GetCurrentSessionAsync(ct)).ReturnsAsync(
            new ServiceClients.Services.Authentication.CurrentSessions.CurrentSession(
                isAutomaticLogoutRequired: true,
                startTime: new UtcDateTime(2017, 4, 12, 14, 34, 59, 452),
                expirationTime: new UtcDateTime(2017, 4, 12, 14, 5, 5)));
        var result = await target.GetRemainingTimeAndLoginDurationInMillisecondsAsync(ct);

        result.Should().Be((0L, 0L));
    }
}
