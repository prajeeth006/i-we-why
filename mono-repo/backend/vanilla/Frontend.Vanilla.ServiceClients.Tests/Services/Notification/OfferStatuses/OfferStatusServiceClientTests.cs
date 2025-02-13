using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Services.Notification.OfferStatuses;
using Frontend.Vanilla.ServiceClients.Tests.TestUtilities;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Notification.OfferStatuses;

public sealed class OfferStatusServiceClientTests : ServiceClientTestsBase
{
    private IOfferStatusServiceClient target;

    protected override void Setup()
    {
        target = new OfferStatusServiceClient(RestClient.Object);
    }

    [Fact]
    public async Task ShouldExecuteCorrectly()
    {
        RestClientResult = new OfferStatusResponse { Status = "OMG" };

        var result = await target.GetAsync(TestMode, "event123", "1"); // Act

        result.Should().Be("OMG");
        VerifyRestClient_ExecuteAsync("Notification.svc/offers/event123/1/status", authenticate: true, resultType: typeof(OfferStatusResponse));
    }
}
