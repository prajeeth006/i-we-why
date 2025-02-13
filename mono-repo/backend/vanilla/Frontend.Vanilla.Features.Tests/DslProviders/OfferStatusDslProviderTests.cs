using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.DslProviders;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Services.Notification;
using Frontend.Vanilla.Testing.Fakes;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.DslProviders;

public class OfferStatusDslProviderTests
{
    private IOfferDslProvider target;
    private Mock<IPosApiNotificationServiceInternal> posApiNotificationService;
    private ExecutionMode mode;
    private Mock<ICurrentUserAccessor> currentUserAccessor;

    public OfferStatusDslProviderTests()
    {
        posApiNotificationService = new Mock<IPosApiNotificationServiceInternal>();
        mode = TestExecutionMode.Get();
        currentUserAccessor = new Mock<ICurrentUserAccessor>();
        currentUserAccessor.SetupGet(a => a.User.Identity.IsAuthenticated).Returns(true);

        target = new OfferDslProvider(posApiNotificationService.Object, currentUserAccessor.Object);
    }

    [Fact]
    public async Task GetStatusAsync_ShouldReturnOfferStatusString()
    {
        posApiNotificationService.Setup(x => x.GetOfferStatusAsync(mode, "memes", "lol")).ReturnsAsync("foo");

        var status = await target.GetStatusAsync(mode, "memes", "lol"); // Act

        status.Should().Be("foo");
    }

    [Theory]
    [InlineData("OFFERED", true)]
    [InlineData("offered", true)]
    [InlineData("INVALID", false)]
    [InlineData("NOT_OFFERED", false)]
    [InlineData("OPTED_IN", false)]
    public async Task IsOfferedAsync_DependsOnOfferStatus(string offerStatus, bool expected)
    {
        posApiNotificationService.Setup(x => x.GetOfferStatusAsync(mode, "memes", "lol")).ReturnsAsync(offerStatus);

        var isOffered = await target.IsOfferedAsync(mode, "memes", "lol"); // Act

        isOffered.Should().Be(expected);
    }

    [Fact]
    public async Task IsOfferedAsync_ShouldReturnFalseForUnauthUser()
    {
        posApiNotificationService.Setup(x => x.GetOfferStatusAsync(mode, "memes", "lol")).ReturnsAsync("foo");
        currentUserAccessor.SetupGet(u => u.User.Identity.IsAuthenticated).Returns(false);

        var isOffered = await target.IsOfferedAsync(mode, "memes", "lol"); // Act

        isOffered.Should().BeFalse();
    }
}
