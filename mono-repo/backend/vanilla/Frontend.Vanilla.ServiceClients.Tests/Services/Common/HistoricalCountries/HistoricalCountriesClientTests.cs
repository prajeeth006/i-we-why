#nullable enable

using System.Collections.Generic;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services.Common.HistoricalCountries;
using Frontend.Vanilla.ServiceClients.Tests.TestUtilities;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Common.HistoricalCountries;

public class HistoricalCountriesClientTests : SimpleGetDataTestsBase
{
    private readonly IHistoricalCountriesServiceClient target;

    public HistoricalCountriesClientTests() => target = new HistoricalCountriesServiceClient(GetDataServiceClient.Object);

    public static TheoryData<UtcDateTime?, string> TestCases => new TheoryData<UtcDateTime?, string>
    {
        { null, "Common.svc/Countries/Historical/?lang=sw-KE" },
        { new UtcDateTime(2000, 1, 2, 0, 0, 0, 0), "Common.svc/Countries/Historical/?lang=sw-KE&date=2000-01-02" },
    };

    [Theory, MemberData(nameof(TestCases))]
    public Task ShouldGetDataCorrectly(UtcDateTime? date, string expectedUrl)
        => RunTest<HistoricalCountryResponse, IReadOnlyList<HistoricalCountry>>(
            () => target.GetAsync(Mode, date),
            expectedDataType: PosApiDataType.Static,
            expectedUrl);
}
