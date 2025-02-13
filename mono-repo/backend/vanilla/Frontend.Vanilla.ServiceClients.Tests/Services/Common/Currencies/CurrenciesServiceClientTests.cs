#nullable enable

using System.Collections.Generic;
using System.Threading.Tasks;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services.Common.Currencies;
using Frontend.Vanilla.ServiceClients.Tests.TestUtilities;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Common.Currencies;

public sealed class CurrenciesServiceClientTests : SimpleGetDataTestsBase
{
    private readonly ICurrenciesServiceClient target;

    public CurrenciesServiceClientTests() => target = new CurrenciesServiceClient(GetDataServiceClient.Object);

    [Fact]
    public Task ShouldGetDataCorrectly()
        => RunTest<CurrenciesResponse, IReadOnlyList<Currency>>(
            act: () => target.GetAsync(Mode),
            expectedDataType: PosApiDataType.Static,
            expectedUrl: "Common.svc/Currency/?lang=sw-KE");
}
