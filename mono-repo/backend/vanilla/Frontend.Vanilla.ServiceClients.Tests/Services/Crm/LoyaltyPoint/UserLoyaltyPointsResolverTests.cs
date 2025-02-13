using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Services.Crm.LoyaltyPoint;
using Frontend.Vanilla.ServiceClients.Services.Crm.LoyaltyProfiles;
using Frontend.Vanilla.ServiceClients.Services.Crm.LoyaltyWeeklyPoint;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Moq;
using Moq;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Crm.LoyaltyPoint;

public class LoyaltyPointsServiceClientTests
{
    private ILoyaltyPointsServiceClient target;
    private LoyaltyConfiguration config;
    private Mock<IBasicLoyaltyProfileServiceClient> basicProfileServiceClient;
    private Mock<ILoyaltyWeeklyPointsServiceClient> weeklyPointsServiceClient;
    private ExecutionMode mode;

    public LoyaltyPointsServiceClientTests()
    {
        config = new LoyaltyConfiguration();
        basicProfileServiceClient = new Mock<IBasicLoyaltyProfileServiceClient>();
        weeklyPointsServiceClient = new Mock<ILoyaltyWeeklyPointsServiceClient>();
        target = new LoyaltyPointsServiceClient(config, basicProfileServiceClient.Object, weeklyPointsServiceClient.Object);
        mode = TestExecutionMode.Get();
    }

    [Fact]
    public async Task ShouldGetTotalPoints_AccordingToConfig()
    {
        config.Points = LoyaltyPointsBalance.Total;
        basicProfileServiceClient.Setup(c => c.GetCachedAsync(mode)).ReturnsAsync(new BasicLoyaltyProfile(points: 666M));

        var result = await target.GetAsync(mode); // Act

        result.Should().Be(666M);
        weeklyPointsServiceClient.VerifyWithAnyArgs(c => c.GetCachedAsync(default), Times.Never);
    }

    [Fact]
    public async Task ShouldGetWeeklyPoints_AccordingToConfig()
    {
        config.Points = LoyaltyPointsBalance.ThisWeek;
        weeklyPointsServiceClient.Setup(c => c.GetCachedAsync(mode)).ReturnsAsync(new LoyaltyWeeklyPoints(points: 666M));

        var result = await target.GetAsync(mode); // Act

        result.Should().Be(666M);
        basicProfileServiceClient.VerifyWithAnyArgs(c => c.GetCachedAsync(default), Times.Never);
    }
}
