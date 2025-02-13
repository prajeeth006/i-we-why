#nullable enable

using System.Collections.Generic;
using System.Threading.Tasks;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services.Common.Timezones;
using Frontend.Vanilla.ServiceClients.Tests.TestUtilities;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Common.Timezones;

public class TimezonesServiceClientTests : SimpleGetDataTestsBase
{
    private readonly ITimezonesServiceClient target;

    public TimezonesServiceClientTests() => target = new TimezonesServiceClient(GetDataServiceClient.Object);

    [Fact]
    public Task ShouldGetDataCorrectly()
        => RunTest<TimezoneResponse, IReadOnlyList<Timezone>>(
            act: () => target.GetAsync(Mode),
            expectedDataType: PosApiDataType.Static,
            expectedUrl: "Common.svc/Timezone/");
}
