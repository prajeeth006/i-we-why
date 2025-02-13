using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Services.Notification.InboxMessages;
using Frontend.Vanilla.ServiceClients.Tests.TestUtilities;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Notification.InboxMessages;

public class SingleInboxMessageServiceClientTests : ServiceClientTestsBase
{
    private ISingleInboxMessageServiceClient target;

    protected override void Setup()
    {
        target = new SingleInboxMessageServiceClient(RestClient.Object);
    }

    [Fact]
    public async Task ShouldCallUrlCorrectly()
    {
        RestClientResult = new InboxMessage();

        var result = await target.GetAsync(TestMode, "testId");

        result.Should().BeSameAs(RestClientResult);
        VerifyRestClient_ExecuteAsync("Notification.svc/inbox/testId", authenticate: true, resultType: typeof(InboxMessage));
    }
}
