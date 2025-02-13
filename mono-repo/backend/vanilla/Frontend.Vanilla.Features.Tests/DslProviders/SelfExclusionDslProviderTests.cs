using System.Globalization;
using System.Security.Claims;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.DslProviders;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Services.ResponsibleGaming;
using Frontend.Vanilla.ServiceClients.Services.ResponsibleGaming.SelfExclusion;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Moq;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.DslProviders;

public class SelfExclusionDslProviderTests
{
    private ISelfExclusionDslProvider target;
    private Mock<ICurrentUserAccessor> currentUserAccessorMock;
    private Mock<IPosApiResponsibleGamingServiceInternal> posApiResponsibleGamingServiceMock;

    private readonly ExecutionMode mode;
    private ClaimsPrincipal user;

    public SelfExclusionDslProviderTests()
    {
        var customCulture = new CultureInfo("en-US");
        customCulture.DateTimeFormat.ShortDatePattern = "M/d/yyyy";
        customCulture.DateTimeFormat.ShortTimePattern = "h:mm tt";
        CultureInfo.CurrentCulture = customCulture;
        currentUserAccessorMock = new Mock<ICurrentUserAccessor>();
        posApiResponsibleGamingServiceMock = new Mock<IPosApiResponsibleGamingServiceInternal>();
        user = TestUser.Get();
        mode = TestExecutionMode.Get();
        currentUserAccessorMock.SetupGet(c => c.User).Returns(() => user);
        posApiResponsibleGamingServiceMock.Setup(p => p.GetSelfExclusionDetailsAsync(mode))
            .ReturnsAsync(new SelfExclusionDetails("self", new UtcDateTime(2021, 2, 12), new UtcDateTime(2021, 3, 22)));

        target = new SelfExclusionDslProvider(currentUserAccessorMock.Object, posApiResponsibleGamingServiceMock.Object);
    }

    [Theory]
    [InlineData(AuthState.Authenticated, "self", 1)]
    [InlineData(AuthState.Anonymous, "", 0)]
    public async Task ShouldGetCategory(AuthState authState, string value, int times)
    {
        user = TestUser.Get(authState);
        var result = await target.GetCategoryAsync(mode);
        result.Should().Be(value);
        posApiResponsibleGamingServiceMock.VerifyWithAnyArgs(p => p.GetSelfExclusionDetailsAsync(It.IsAny<ExecutionMode>()), Times.Exactly(times));
    }

    [Theory]
    [InlineData(AuthState.Authenticated, "2/12/2021 5:00 AM", 1)]
    [InlineData(AuthState.Anonymous, "", 0)]
    public async Task ShouldGetStartDate(AuthState authState, string value, int times)
    {
        user = TestUser.Get(authState);
        var result = await target.GetStartDateAsync(mode);
        result.Should().Be(value);
        posApiResponsibleGamingServiceMock.VerifyWithAnyArgs(p => p.GetSelfExclusionDetailsAsync(It.IsAny<ExecutionMode>()), Times.Exactly(times));
    }

    [Theory]
    [InlineData(AuthState.Authenticated, "3/22/2021 5:00 AM", 1)]
    [InlineData(AuthState.Anonymous, "", 0)]
    public async Task ShouldGetEndDate(AuthState authState, string value, int times)
    {
        user = TestUser.Get(authState);
        var result = await target.GetEndDateAsync(mode);
        result.Should().Be(value);
        posApiResponsibleGamingServiceMock.VerifyWithAnyArgs(p => p.GetSelfExclusionDetailsAsync(It.IsAny<ExecutionMode>()), Times.Exactly(times));
    }
}
