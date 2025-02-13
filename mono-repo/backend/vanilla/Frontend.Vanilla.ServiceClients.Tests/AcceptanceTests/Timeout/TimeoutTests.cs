using System;
using Frontend.Vanilla.ServiceClients.Services.Common;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.AcceptanceTests.Timeout;

public class TimeoutTests : AcceptanceTestsBase<IPosApiCommonService>
{
    [Fact]
    public void ShouldCallRestApiWithTimeout()
    {
        SetupRestResponse("Common.svc/Currency", "AcceptanceTests/Timeout/Currency.json");

        Service.GetCurrencies();

        Verify(ExecutedRequests[0], "http://api.bwin.com/V3/Common.svc/Currency/?lang=en-US", TimeSpan.FromSeconds(5));
    }
}
