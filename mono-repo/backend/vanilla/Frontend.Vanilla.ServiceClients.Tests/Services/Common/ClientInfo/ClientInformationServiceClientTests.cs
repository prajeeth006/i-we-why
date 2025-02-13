#nullable enable

using System.Threading.Tasks;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services.Common.ClientInfo;
using Frontend.Vanilla.ServiceClients.Tests.TestUtilities;
using Moq;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Common.ClientInfo;

public class ClientInformationServiceClientTests : SimpleGetDataTestsBase
{
    private readonly IClientInformationServiceClient target;

    public ClientInformationServiceClientTests()
    {
        var config = Mock.Of<IServiceClientsConfiguration>(c => c.AccessId == "acc-id");
        target = new ClientInformationServiceClient(GetDataServiceClient.Object, config);
    }

    [Fact]
    public Task ShouldGetDataCorrectly()
        => RunTest<ClientInformation, ClientInformation>(
            act: () => target.GetAsync(Mode),
            expectedDataType: PosApiDataType.Static,
            expectedUrl: "Common.svc/ClientInformation",
            expectedCacheKey: "Common.svc/ClientInformation#acc-id");
}
