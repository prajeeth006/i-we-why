using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services.Authentication.OTP;
using Frontend.Vanilla.ServiceClients.Tests.TestUtilities;
using Moq;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Authentication.OTP;

public class VerificationStatusServiceClientTest : ServiceClientTestsBase
{
    private IVerificationStatusServiceClient target;
    private Mock<IServiceClientsConfiguration> config;

    protected override void Setup()
    {
        config = new Mock<IServiceClientsConfiguration>();
        target = new VerificationStatusServiceClient(RestClient.Object, Cache.Object, config.Object);
    }

    [Fact]
    public async Task ShouldCallUrlCorrectly()
    {
        config.SetupGet(c => c.CacheTimeEndpoints).Returns(new Dictionary<string, TimeSpan>
            { { "OTP.VerificationStatus", TimeSpan.FromMinutes(1) } });
        var status = new Dictionary<string, string> { ["Email"] = "verified" };
        RestClientResult = new VerificationStatusResponse { Status = status };

        var result = await target.GetAsync(TestMode, true);

        result.Should().BeSameAs(status);
        VerifyRestClient_ExecuteAsync("Authentication.svc/OTP/VerificationStatus", authenticate: true, resultType: typeof(VerificationStatusResponse));
    }
}
