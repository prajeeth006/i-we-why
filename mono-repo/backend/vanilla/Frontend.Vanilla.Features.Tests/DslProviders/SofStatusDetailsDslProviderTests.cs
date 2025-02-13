using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.DslProviders;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Services.Account;
using Frontend.Vanilla.ServiceClients.Services.Account.SofStatus;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Moq;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.DslProviders;

public class SofStatusDetailsDslProviderTests
{
    private ISofStatusDetailsDslProvider target;
    private Mock<ICurrentUserAccessor> currentUserAccessorMock;
    private Mock<IPosApiAccountServiceInternal> posApiAccountServiceInternalMock;

    private readonly ExecutionMode mode;

    public SofStatusDetailsDslProviderTests()
    {
        currentUserAccessorMock = new Mock<ICurrentUserAccessor>();
        posApiAccountServiceInternalMock = new Mock<IPosApiAccountServiceInternal>();
        mode = TestExecutionMode.Get();
        currentUserAccessorMock.SetupGet(a => a.User.Identity.IsAuthenticated).Returns(true);
        posApiAccountServiceInternalMock.Setup(p => p.GetSofStatusDetailsAsync(It.IsAny<ExecutionMode>(), It.IsAny<bool>())).ReturnsAsync(new SofStatusDetails("red", 6));

        target = new SofStatusDetailsDslProvider(posApiAccountServiceInternalMock.Object, currentUserAccessorMock.Object);
    }

    [Fact]
    public async Task ShouldGetSofStatusForAuthenticatedUser()
    {
        var result = await target.GetSofStatusAsync(mode);

        result.Should().Be("red");
        posApiAccountServiceInternalMock.VerifyWithAnyArgs(p => p.GetSofStatusDetailsAsync(It.IsAny<ExecutionMode>(), It.IsAny<bool>()), Times.Once);
    }

    [Fact]
    public async Task ShouldGetSofStatusForAnonymousUser()
    {
        currentUserAccessorMock.SetupGet(a => a.User.Identity.IsAuthenticated).Returns(false);
        var result = await target.GetSofStatusAsync(mode);

        result.Should().BeNull();
        posApiAccountServiceInternalMock.VerifyWithAnyArgs(p => p.GetSofStatusDetailsAsync(It.IsAny<ExecutionMode>(), It.IsAny<bool>()), Times.Never);
    }

    [Fact]
    public async Task ShouldGetRedStatusDaysForAuthenticatedUser()
    {
        var result = await target.GetRedStatusDaysAsync(mode);

        result.Should().Be(6);
        posApiAccountServiceInternalMock.VerifyWithAnyArgs(p => p.GetSofStatusDetailsAsync(It.IsAny<ExecutionMode>(), It.IsAny<bool>()), Times.Once);
    }

    [Fact]
    public async Task ShouldGetRedStatusDaysForAnonymousUser()
    {
        currentUserAccessorMock.SetupGet(a => a.User.Identity.IsAuthenticated).Returns(false);
        var result = await target.GetRedStatusDaysAsync(mode);

        result.Should().Be(-1);
        posApiAccountServiceInternalMock.VerifyWithAnyArgs(p => p.GetSofStatusDetailsAsync(It.IsAny<ExecutionMode>(), It.IsAny<bool>()), Times.Never);
    }
}
