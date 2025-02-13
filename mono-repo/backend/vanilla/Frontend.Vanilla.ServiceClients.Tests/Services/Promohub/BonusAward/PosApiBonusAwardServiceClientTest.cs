using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Services.Promohub.BonusAward;
using Frontend.Vanilla.ServiceClients.Tests.TestUtilities;
using Frontend.Vanilla.Testing.Fakes;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Promohub.BonusAward;

public class PosApiBonusAwardServiceClientTest : ServiceClientTestsBase
{
    private IPosApiBonusAwardServiceClient target;
    private TestLogger<PosApiBonusAwardServiceClient> log;

    protected override void Setup()
    {
        log = new TestLogger<PosApiBonusAwardServiceClient>();
        target = new PosApiBonusAwardServiceClient(RestClient.Object, log);
    }

    [Fact]
    public async Task GetValueTicketAsync_ShouldExecuteCorrectly()
    {
        var response = new BonusAwardResponse();
        RestClientResult = new BonusAwardDetailDto();

        // Act
        var result = await target.GetBonusAwardAsync(TestMode, "12");

        // Assert
        result.Should().BeEquivalentTo(response);
        VerifyRestClient_ExecuteAsync("Promohub.svc/details/bonus/12/award", authenticate: true, resultType: typeof(BonusAwardDetailDto));
    }
}
