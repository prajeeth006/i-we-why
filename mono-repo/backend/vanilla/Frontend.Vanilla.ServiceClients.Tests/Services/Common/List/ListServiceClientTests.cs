#nullable enable

using System.Collections.Generic;
using System.Threading.Tasks;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services.Common.List;
using Frontend.Vanilla.ServiceClients.Tests.TestUtilities;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Common.List;

public class ListServiceClientTests : SimpleGetDataTestsBase
{
    private readonly IListServiceClient target;

    public ListServiceClientTests() => target = new ListServiceClient(GetDataServiceClient.Object);

    [Fact]
    public Task ShouldGetDataCorrectly()
        => RunTest<ListResponse, IReadOnlyList<string>>(
            act: () => target.GetAsync(Mode, "xxx"),
            expectedDataType: PosApiDataType.Static,
            expectedUrl: "Common.svc/List/xxx");
}
