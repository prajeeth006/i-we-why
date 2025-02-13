using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.Diagnostics.Health;
using Frontend.Vanilla.Features.Inbox;
using Frontend.Vanilla.Features.Inbox.Models;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Services.Notification;
using Frontend.Vanilla.ServiceClients.Services.Notification.InboxMessages;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Inbox;

public class InboxHealthCheckTests
{
    private IHealthCheck target;
    private Mock<IInboxConfiguration> inboxConfig;
    private Mock<ICurrentUserAccessor> currentUserAccessor;
    private Mock<IPosApiNotificationService> posapiNotificationService;
    private Mock<IInboxMessagesClientValuesProvider> inboxMessagesClientValuesProvider;

    public InboxHealthCheckTests()
    {
        inboxConfig = new Mock<IInboxConfiguration>();
        currentUserAccessor = new Mock<ICurrentUserAccessor>();
        posapiNotificationService = new Mock<IPosApiNotificationService>();
        inboxMessagesClientValuesProvider = new Mock<IInboxMessagesClientValuesProvider>();
        target = new InboxHealthCheck(inboxConfig.Object, currentUserAccessor.Object, posapiNotificationService.Object, inboxMessagesClientValuesProvider.Object);

        inboxConfig.SetupGet(o => o.Enabled).Returns(true);
        currentUserAccessor.SetupGet(o => o.User.Identity.IsAuthenticated).Returns(true);
    }

    [Fact]
    public void ShouldExposeCorrectMetadata()
        => target.Metadata.Should().NotBeNull().And.BeSameAs(target.Metadata, "should be singleton");

    [Fact]
    public async Task ExecuteAsync_DisabledFeature()
    {
        inboxConfig.SetupGet(o => o.Enabled).Returns(false);
        var result = await target.ExecuteAsync(CancellationToken.None);
        result.Should().Be(HealthCheckResult.DisabledFeature);
    }

    [Fact]
    public async Task ExecuteAsync_NotAuthenticated()
    {
        currentUserAccessor.SetupGet(o => o.User.Identity.IsAuthenticated).Returns(false);
        var result = await target.ExecuteAsync(CancellationToken.None);
        result.Should().BeEquivalentTo(HealthCheckResult.CreateSuccess("User needs to be logged in."));
    }

    [Fact]
    public async Task ExecuteAsync_ShouldWork()
    {
        posapiNotificationService.Setup(o => o.GetInboxMessageCountAsync("NEW", CancellationToken.None)).ReturnsAsync(5);
        var newMessages = new List<InboxMessage> { new InboxMessage(), new InboxMessage() };
        posapiNotificationService.Setup(o => o.GetInboxMessagesAsync(new InboxMessageFilter { Status = "NEW" }, CancellationToken.None)).ReturnsAsync(newMessages);
        var allMessages = new List<InboxMessage> { new InboxMessage(), new InboxMessage() };
        posapiNotificationService.Setup(o => o.GetInboxMessagesAsync(new InboxMessageFilter { Status = "ALL" }, CancellationToken.None)).ReturnsAsync(allMessages);
        var result = await target.ExecuteAsync(CancellationToken.None);
        result.Should().BeEquivalentTo(HealthCheckResult.CreateSuccess("Inbox messages fetched successfully. Count of new messages is 5."));
    }

    [Fact]
    public async Task ExecuteAsync_ShouldFail()
    {
        posapiNotificationService.Setup(o => o.GetInboxMessageCountAsync("NEW", CancellationToken.None)).ReturnsAsync(2);
        var newMessages = new List<InboxMessage> { new InboxMessage(), new InboxMessage() };
        posapiNotificationService.Setup(o => o.GetInboxMessagesAsync(It.Is<InboxMessageFilter>(i => i.Status == "NEW"), CancellationToken.None))
            .ReturnsAsync(newMessages);
        var allMessages = new List<InboxMessage> { new InboxMessage(), new InboxMessage() };
        posapiNotificationService.Setup(o => o.GetInboxMessagesAsync(It.Is<InboxMessageFilter>(i => i.Status == "ALL"), CancellationToken.None))
            .ReturnsAsync(allMessages);
        inboxMessagesClientValuesProvider.Setup(i => i.GetMessages(newMessages, true)).Returns(
            newMessages.Select(m => new InboxMessageViewModel { Error = "Failed to find new one." }).ToList());
        inboxMessagesClientValuesProvider.Setup(i => i.GetMessages(allMessages, true)).Returns(
            newMessages.Select(m => new InboxMessageViewModel { Error = "Failed to find this one." }).ToList());

        var result = await target.ExecuteAsync(CancellationToken.None);
        result.Should().BeEquivalentTo(HealthCheckResult.CreateFailed("Received a total of 4 message(s) (of which 2 new message(s)), but error found in 4 message(s).",
            "Failed to find new one., Failed to find new one., Failed to find this one., Failed to find this one."));
    }

    [Fact]
    public async Task ExecuteAsync_ShouldFailWithException()
    {
        var exception = new Exception("IAmX");
        posapiNotificationService.Setup(o => o.GetInboxMessageCountAsync("NEW", CancellationToken.None)).ThrowsAsync(exception);

        var result = await target.ExecuteAsync(CancellationToken.None);
        result.Should().BeEquivalentTo(HealthCheckResult.CreateFailed("Error occured trying to fetch inbox data. Check details.", exception));
    }
}
