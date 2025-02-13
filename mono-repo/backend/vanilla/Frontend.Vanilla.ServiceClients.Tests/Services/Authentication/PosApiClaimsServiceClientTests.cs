using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Services.Authentication;
using Frontend.Vanilla.ServiceClients.Tests.TestUtilities;
using Frontend.Vanilla.Testing.Moq;
using Moq;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Authentication;

public class PosApiClaimsServiceClientTests : ServiceClientTestsBase
{
    private IPosApiClaimsServiceClient target;
    private Mock<IPosApiClaimsDeserializer> claimsDeserializer;

    protected override void Setup()
    {
        claimsDeserializer = new Mock<IPosApiClaimsDeserializer>();
        target = new PosApiClaimsServiceClient(RestClient.Object, claimsDeserializer.Object);
    }

    public static readonly IEnumerable<object[]> TestCases = new[]
    {
        new object[] { null, true, "Authentication.svc/AnonymousClaims?cached=True", null },
        new object[] { null, false, "Authentication.svc/AnonymousClaims?cached=False", null },
        new object[]
        {
            new PosApiAuthTokens("user-token", "session-token"),
            true,
            "Authentication.svc/ClaimsUnauthorized?cached=True",
            new RestRequestHeaders
            {
                { PosApiHeaders.UserToken, "user-token" },
                { PosApiHeaders.SessionToken, "session-token" },
            },
        },
        new object[]
        {
            new PosApiAuthTokens("user-token", "session-token"),
            false,
            "Authentication.svc/ClaimsUnauthorized?cached=False",
            new RestRequestHeaders
            {
                { PosApiHeaders.UserToken, "user-token" },
                { PosApiHeaders.SessionToken, "session-token" },
            },
        },
    };

    [Theory, MemberData(nameof(TestCases))]
    internal async Task ShouldGetClaims(PosApiAuthTokens authTokens, bool cached, string expectedUrl, RestRequestHeaders expectedHeaders)
    {
        var response = new ClaimsResponse();
        var claims = Mock.Of<IReadOnlyList<Claim>>();
        RestClientResult = response;
        claimsDeserializer.SetupWithAnyArgs(d => d.Deserialize(null, null)).Returns(claims);

        // Act
        var result = await target.GetAsync(TestMode, authTokens, cached);

        result.Should().BeSameAs(claims);
        VerifyRestClient_ExecuteAsync(expectedUrl, resultType: response.GetType(), headers: expectedHeaders);
        claimsDeserializer.Verify(d => d.Deserialize(response, authTokens));
    }
}
