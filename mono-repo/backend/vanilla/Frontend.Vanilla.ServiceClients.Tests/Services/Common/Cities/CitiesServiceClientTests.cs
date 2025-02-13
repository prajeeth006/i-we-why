#nullable enable

using System.Collections.Generic;
using System.Threading.Tasks;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services.Common.Cities;
using Frontend.Vanilla.ServiceClients.Tests.TestUtilities;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Common.Cities;

public sealed class CitiesServiceClientTests : SimpleGetDataTestsBase
{
    private readonly ICitiesServiceClient target;

    public CitiesServiceClientTests() => target = new CitiesServiceClient(GetDataServiceClient.Object);

    [Theory]
    [InlineData("AT", "W", "Common.svc/Cities/?lang=sw-KE&country=AT&countryArea=W")]
    [InlineData(null, null, "Common.svc/Cities/?lang=sw-KE")]
    public Task ShouldGetDataCorrectly(string? countryId, string? countryAreaId, string expectedUrl)
        => RunTest<CitiesResponse, IReadOnlyList<City>>(
            act: () => target.GetAsync(Mode, countryId, countryAreaId),
            expectedDataType: PosApiDataType.Static,
            expectedUrl);
}
