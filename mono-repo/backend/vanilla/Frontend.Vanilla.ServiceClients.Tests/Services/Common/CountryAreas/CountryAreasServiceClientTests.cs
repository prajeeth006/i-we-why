#nullable enable

using System.Collections.Generic;
using System.Threading.Tasks;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services.Common.CountryAreas;
using Frontend.Vanilla.ServiceClients.Tests.TestUtilities;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Common.CountryAreas;

public class CountryAreasServiceClientTests : SimpleGetDataTestsBase
{
    private readonly ICountryAreasServiceClient target;

    public CountryAreasServiceClientTests() => target = new CountryAreasServiceClient(GetDataServiceClient.Object);

    [Theory]
    [InlineData("AT", "Common.svc/CountryArea/?lang=sw-KE&country=AT")]
    [InlineData(null, "Common.svc/CountryArea/?lang=sw-KE")]
    public Task ShouldGetDataCorrectly(string? countryId, string expectedUrl)
        => RunTest<CountryAreaResponse, IReadOnlyList<CountryArea>>(
            act: () => target.GetAsync(Mode, countryId),
            expectedDataType: PosApiDataType.Static,
            expectedUrl);
}
