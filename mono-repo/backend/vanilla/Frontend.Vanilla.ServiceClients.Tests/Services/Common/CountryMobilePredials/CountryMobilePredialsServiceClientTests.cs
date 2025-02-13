#nullable enable

using System.Collections.Generic;
using System.Threading.Tasks;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services.Common.CountryMobilePredials;
using Frontend.Vanilla.ServiceClients.Tests.TestUtilities;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Common.CountryMobilePredials;

public class CountryMobilePredialsServiceClientTests : SimpleGetDataTestsBase
{
    private readonly ICountryMobilePredialsServiceClient target;

    public CountryMobilePredialsServiceClientTests() => target = new CountryMobilePredialsServiceClient(GetDataServiceClient.Object);

    [Theory]
    [InlineData("666", "Common.svc/CountryMobilePredial/666")]
    [InlineData(null, "Common.svc/CountryMobilePredial/")]
    public Task ShouldGetDataCorrectly(string? countryPredial, string expectedUrl)
        => RunTest<CountryMobilePredialsResponse, IReadOnlyList<CountryMobilePredial>>(
            act: () => target.GetAsync(Mode, countryPredial),
            expectedDataType: PosApiDataType.Static,
            expectedUrl);
}
