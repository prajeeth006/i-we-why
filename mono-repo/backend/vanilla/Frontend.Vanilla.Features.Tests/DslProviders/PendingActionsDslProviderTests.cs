using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.DslProviders;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Services.Authentication;
using Frontend.Vanilla.ServiceClients.Services.Authentication.PendingActions;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.DslProviders;

public class PendingActionsDslProviderTests
{
    private IPendingActionsDslProvider target;
    private Mock<IPosApiAuthenticationService> authService;
    private Mock<ICurrentUserAccessor> currentUserAccessor;

    public PendingActionsDslProviderTests()
    {
        authService = new Mock<IPosApiAuthenticationService>();
        currentUserAccessor = new Mock<ICurrentUserAccessor>();
        target = new PendingActionsDslProvider(authService.Object, currentUserAccessor.Object);
    }

    [Fact]
    public void ShouldBeFalseIfUserIsNotAuthenticated()
    {
        currentUserAccessor.SetupGet(o => o.User.Identity.IsAuthenticated).Returns(false);

        target.HasActionWithReactionNeeded().Should().Be(false);
    }

    [Fact]
    public void ShouldBeTrue()
    {
        currentUserAccessor.SetupGet(o => o.User.Identity.IsAuthenticated).Returns(true);
        authService.Setup(o => o.GetPendingActions()).Returns(new PendingActionList(actions: new List<PendingAction>
            { new PendingAction("action", true, new List<KeyValuePair<string, string>>()) }));

        target.HasActionWithReactionNeeded().Should().Be(true);
    }

    [Fact]
    public void ShouldBeFalseIfUserIsAuthenticatedButDoesNotHaveActions()
    {
        currentUserAccessor.SetupGet(o => o.User.Identity.IsAuthenticated).Returns(true);
        authService.Setup(o => o.GetPendingActions()).Returns(new PendingActionList(actions: new List<PendingAction>
            { new PendingAction("action", false, new List<KeyValuePair<string, string>>()) }));

        target.HasActionWithReactionNeeded().Should().Be(false);
    }
}
