using System.Net.Http;
using System.Threading.Tasks;
using Frontend.Vanilla.ServiceClients.Services.ResponsibleGaming.RealityCheck;
using Frontend.Vanilla.ServiceClients.Tests.TestUtilities;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.ResponsibleGaming.RealityCheck;

public sealed class RealityCheckServiceClientTests : ServiceClientTestsBase
{
    private IRealityCheckServiceClient target;

    protected override void Setup()
    {
        target = new RealityCheckServiceClient(RestClient.Object);
    }

    [Fact]
    public async Task RcpuStatusAsync_ShouldExecuteCorrectly()
    {
        RestClientResult = new RcpuStatusResponse();
        await target.RcpuStatusAsync(TestMode); // Act

        VerifyRestClient_ExecuteAsync("ResponsibleGaming.svc/RealityCheck/RcpuStatus",
            authenticate: true,
            resultType: typeof(RcpuStatusResponse),
            method: HttpMethod.Get);
    }

    [Fact]
    public async Task RcpuContinueAsync_ShouldExecuteCorrectly()
    {
        await target.RcpuContinueAsync(TestMode); // Act

        VerifyRestClient_ExecuteAsync("ResponsibleGaming.svc/RealityCheck/RcpuContinue", authenticate: true, method: HttpMethod.Post);
    }

    [Fact]
    public async Task RcpuQuitAsync_ShouldExecuteCorrectly()
    {
        await target.RcpuQuitAsync(TestMode); // Act

        VerifyRestClient_ExecuteAsync("ResponsibleGaming.svc/RealityCheck/RcpuQuit", authenticate: true, method: HttpMethod.Post);
    }
}
