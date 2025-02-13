using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Services.Retail.ValueTicket;
using Frontend.Vanilla.ServiceClients.Tests.TestUtilities;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Retail.ValueTicket;

public class ValueTicketServiceClientTests : ServiceClientTestsBase
{
    private IValueTicketServiceClient target;

    public ValueTicketServiceClientTests() => target = new ValueTicketServiceClient(RestClient.Object);

    protected override void Setup()
    {
        target = new ValueTicketServiceClient(RestClient.Object);
    }

    [Fact]
    public async Task GetValueTicketAsync_ShouldExecuteCorrectly()
    {
        // Setup
        var request = new ValueTicketRequest
        {
            Id = "v",
            Source = "terminal",
            ShopId = "1",
            TerminalId = "2",
        };
        var response = new ValueTicketResponse();
        RestClientResult = new ValueTicketDto();

        // Act
        var result = await target.GetValueTicketAsync(TestMode, request);

        // Assert
        result.Should().BeEquivalentTo(response);
        VerifyRestClient_ExecuteAsync("Retail.svc/ValueTicket/v?source=terminal&shopId=1&terminalId=2", authenticate: true, resultType: typeof(ValueTicketDto));
    }
}
