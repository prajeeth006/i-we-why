using System.Net.Http;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Services.Retail.PayoutValueTicket;
using Frontend.Vanilla.ServiceClients.Tests.TestUtilities;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Retail.PayoutValueTicket;

public class PayoutValueTicketServiceClientTests : ServiceClientTestsBase
{
    private IPayoutValueTicketServiceClient target;

    public PayoutValueTicketServiceClientTests() => target = new PayoutValueTicketServiceClient(RestClient.Object);

    protected override void Setup()
    {
        target = new PayoutValueTicketServiceClient(RestClient.Object);
    }

    [Fact]
    public async Task PayoutValueTicketAsync_ShouldExecuteCorrectly()
    {
        // Setup
        var request = new PayoutValueTicketRequest { Id = "v" };
        var response = new PayoutValueTicketResponse();
        RestClientResult = new PayoutValueTicketDto();

        // Act
        var result = await target.PayoutValueTicketAsync(TestMode, request);

        // Assert
        result.Should().BeEquivalentTo(response);
        VerifyRestClient_ExecuteAsync(
            url: "Retail.svc/PayoutValueTicket/v",
            method: HttpMethod.Post,
            authenticate: true,
            content: request,
            resultType: typeof(PayoutValueTicketDto));
    }
}
