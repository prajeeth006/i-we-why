#nullable enable

using System.Collections.Generic;
using System.Threading.Tasks;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services.Common.Countries;
using Frontend.Vanilla.ServiceClients.Tests.TestUtilities;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Common.Countries;

public class CountriesServiceClientTests : SimpleGetDataTestsBase
{
    private readonly ICountriesServiceClient target;

    public CountriesServiceClientTests() => target = new CountriesServiceClient(GetDataServiceClient.Object);

    [Fact]
    public Task ShouldGetCountries()
        => RunTest<CountriesResponse, IReadOnlyList<Country>>(
            act: () => target.GetAsync(Mode),
            expectedDataType: PosApiDataType.Static,
            expectedUrl: "Common.svc/Country/?lang=sw-KE");

    [Fact]
    public Task ShouldGetAllCountries()
        => RunTest<CountriesResponse, IReadOnlyList<Country>>(
            act: () => target.GetAllAsync(Mode),
            expectedDataType: PosApiDataType.Static,
            expectedUrl: "Common.svc/AllCountries/?lang=sw-KE");
}
