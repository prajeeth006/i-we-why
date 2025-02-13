using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Features.TrackerId;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Services.Crm;
using Frontend.Vanilla.ServiceClients.Services.Crm.SignUpBonuses;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Moq;
using Frontend.Vanilla.Testing.Xunit;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.TrackerId;

public class SignUpBonusResolverBaseTests
{
    private ISignUpBonusResolver target;
    private Mock<SignUpBonusResolverBase> underlyingMock;

    public SignUpBonusResolverBaseTests()
    {
        underlyingMock = new Mock<SignUpBonusResolverBase>();
        target = underlyingMock.Object;
    }

    [Theory, BooleanData]
    public void GetBonusTrackerId_ShouldDelegateToExecutionMode(bool includeCookie)
    {
        underlyingMock.Setup(m => m.GetBonusTrackerIdAsync(ExecutionMode.Sync, includeCookie)).ReturnsAsync(123);

        var result = target.GetBonusTrackerId(includeCookie); // Act

        result.Should().Be(123);
    }

    [Theory, BooleanData]
    public async Task GetBonusTrackerIdAsync_ShouldDelegateToExecutionMode(bool includeCookie)
    {
        var ct = TestCancellationToken.Get();
        underlyingMock.Setup(m => m.GetBonusTrackerIdAsync(ExecutionMode.Async(ct), includeCookie)).ReturnsAsync(123);

        var result = await target.GetBonusTrackerIdAsync(includeCookie, ct); // Act

        result.Should().Be(123);
    }
}

public class SignUpBonusResolverTests
{
    private SignUpBonusResolverBase target;
    private Mock<ICurrentUserAccessor> currentUserAccessor;
    private Mock<ITrackerIdResolver> trackerIdResolver;
    private Mock<IPosApiCrmServiceInternal> posApiCrmService;
    private ExecutionMode mode;

    public SignUpBonusResolverTests()
    {
        currentUserAccessor = new Mock<ICurrentUserAccessor>();
        trackerIdResolver = new Mock<ITrackerIdResolver>();
        posApiCrmService = new Mock<IPosApiCrmServiceInternal>();
        target = new SignUpBonusResolver(currentUserAccessor.Object, trackerIdResolver.Object, posApiCrmService.Object);

        mode = TestExecutionMode.Get();
        currentUserAccessor.SetupGet(c => c.User.Identity.IsAuthenticated).Returns(false);
        trackerIdResolver.Setup(p => p.Resolve(It.IsAny<bool>())).Returns("666");
        posApiCrmService.Setup(s => s.BonusExistsAsync(mode, 666, SignUpBonusStages.Landing)).ReturnsAsync(true);
    }

    [Fact]
    public async Task ShouldGetCorrectly()
    {
        var result = await target.GetBonusTrackerIdAsync(mode, false); // Act

        result.Should().Be(666);
    }

    [Theory, ValuesData(null, "str", "123str")]
    public async Task ShouldGetNull_IfNotIntValue(string value)
    {
        trackerIdResolver.Setup(c => c.Resolve(It.IsAny<bool>()))
            .Returns(value != null ? new TrimmedRequiredString(value) : null);

        await RunAndExpectNull(calledPosApi: Times.Never()); // Act
    }

    [Fact]
    public async Task ShouldGetNull_IfAuthenticated()
    {
        currentUserAccessor.SetupGet(a => a.User.Identity.IsAuthenticated).Returns(true);

        await RunAndExpectNull(gotTrackerId: Times.Never(), calledPosApi: Times.Never()); // Act
    }

    [Fact]
    public async Task ShouldGetNull_IfBonusNotFoundOnPosApi()
    {
        posApiCrmService.Reset();

        await RunAndExpectNull(calledPosApi: Times.Once()); // Act
    }

    private async Task RunAndExpectNull(Times? gotTrackerId = null, Times? calledPosApi = null)
    {
        var result = await target.GetBonusTrackerIdAsync(mode, true); // Act

        result.Should().BeNull();
        trackerIdResolver.VerifyWithAnyArgs(r => r.Resolve(false), gotTrackerId ?? Times.AtMostOnce());
        posApiCrmService.VerifyWithAnyArgs(s => s.BonusExistsAsync(default, default, null), calledPosApi ?? Times.AtMostOnce());
    }
}
