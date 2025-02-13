using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Services.Notification.InboxMessages;
using Frontend.Vanilla.ServiceClients.Tests.TestUtilities;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Notification.InboxMessages;

public class InboxMessageCountServiceClientTests : ServiceClientTestsBase
{
    private IInboxMessageCountServiceClient target;

    protected override void Setup()
    {
        target = new InboxMessageCountServiceClient(RestClient.Object);
    }

    [Theory]
    [InlineData("LOL", "Notification.svc/inbox/count?status=LOL")]
    [InlineData(null, "Notification.svc/inbox/count")]
    public async Task ShouldCallUrlCorrectly(string status, string expectedUrl)
    {
        RestClientResult = 123;

        var result = await target.GetAsync(TestMode, status);

        result.Should().Be(123);
        VerifyRestClient_ExecuteAsync(expectedUrl, authenticate: true, resultType: typeof(int));
    }
}
