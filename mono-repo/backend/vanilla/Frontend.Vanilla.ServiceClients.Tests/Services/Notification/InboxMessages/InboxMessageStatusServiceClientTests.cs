using System.Net.Http;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Services;
using Frontend.Vanilla.ServiceClients.Services.Notification.InboxMessages;
using Frontend.Vanilla.ServiceClients.Tests.TestUtilities;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Notification.InboxMessages;

public class InboxMessageStatusServiceClientTests : ServiceClientTestsBase
{
    private IInboxMessageStatusServiceClient target;

    protected override void Setup()
    {
        target = new InboxMessageStatusServiceClient(RestClient.Object);
    }

    [Fact]
    public async Task ShouldUpdateStatusCorrectly()
    {
        var messageIds = new[] { "1", "2", "3" };

        await target.UpdateAsync(TestMode, messageIds, "UNREAD"); // Act

        VerifyRestClient_ExecuteAsync(PosApiEndpoint.Notification.InboxStatus.ToString(), HttpMethod.Post, true, hasContent: true);
        RestClientCalls[0].Request.Content.Should().BeEquivalentTo(new UpdateInboxMessageStatusDto
        {
            MessageIds = messageIds,
            NewStatus = "UNREAD",
        });
    }
}
