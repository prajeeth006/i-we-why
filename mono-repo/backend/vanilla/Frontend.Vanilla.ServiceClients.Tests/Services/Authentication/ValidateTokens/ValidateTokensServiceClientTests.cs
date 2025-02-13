using System.Threading.Tasks;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Services;
using Frontend.Vanilla.ServiceClients.Services.Authentication.ValidateTokens;
using Frontend.Vanilla.ServiceClients.Tests.TestUtilities;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Authentication.ValidateTokens;

public class ValidateTokensServiceClientTests : ServiceClientTestsBase
{
    private ValidateTokensServiceClient target;

    protected override void Setup()
        => target = new ValidateTokensServiceClient(RestClient.Object);

    [Fact]
    public async Task ValidateAsync_ShouldCallValidateUrl()
    {
        var authTokens = new PosApiAuthTokens("uu", "ss");

        // Act
        await target.ValidateAsync(TestMode, authTokens);

        VerifyRestClient_ExecuteAsync(PosApiEndpoint.Authentication.ValidateTokens.ToString(), headers: new RestRequestHeaders
        {
            { PosApiHeaders.UserToken, "uu" },
            { PosApiHeaders.SessionToken, "ss" },
        });
    }
}
