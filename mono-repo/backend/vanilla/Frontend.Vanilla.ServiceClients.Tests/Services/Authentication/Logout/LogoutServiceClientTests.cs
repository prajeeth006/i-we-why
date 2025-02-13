using System;
using System.Net.Http;
using System.Security.Claims;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Claims;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Security.Claims;
using Frontend.Vanilla.ServiceClients.Services.Authentication;
using Frontend.Vanilla.ServiceClients.Services.Authentication.Logout;
using Frontend.Vanilla.ServiceClients.Tests.TestUtilities;
using Frontend.Vanilla.Testing.FluentAssertions;
using Frontend.Vanilla.Testing.Moq;
using Moq;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Authentication.Logout;

public class LogoutServiceClientTests : ServiceClientTestsBase
{
    private ILogoutServiceClient target;
    private ICurrentUserAccessor currentUserAccessor;
    private Mock<IClaimsCache> claimsCache;
    private Mock<IClaimsServiceClient> setupUserServiceClient;

    protected override void Setup()
    {
        currentUserAccessor = Mock.Of<ICurrentUserAccessor>();
        claimsCache = new Mock<IClaimsCache>();
        setupUserServiceClient = new Mock<IClaimsServiceClient>();
        target = new LogoutServiceClient(RestClient.Object, currentUserAccessor, claimsCache.Object, setupUserServiceClient.Object);

        currentUserAccessor.User = new ClaimsPrincipal(new ClaimsIdentity(new[]
        {
            new Claim(PosApiClaimTypes.UserToken, "user-id"),
            new Claim(PosApiClaimTypes.SessionToken, "session-id"),
        }));
    }

    [Fact]
    public Task ShouldLogout()
        => RunTest(target.LogoutAsync, expectedPath: "Logout");

    [Fact]
    public Task ShouldCancelWorkflow()
        => RunTest(target.CancelWorkflowAsync, "CancelWorkflow");

    private async Task RunTest(Func<ExecutionMode, Task> act, string expectedPath)
    {
        await act(TestMode);

        VerifyRestClient_ExecuteAsync("Authentication.svc/" + expectedPath, HttpMethod.Post, authenticate: true);
        setupUserServiceClient.Verify(c => c.SetupAnonymousUserAsync(TestMode));
        claimsCache.Verify(c => c.RemoveAsync(TestMode, new PosApiAuthTokens("user-id", "session-id")));
    }

    [Fact]
    public async Task ShouldNotDoRequest_IfNotAuthenticated()
    {
        currentUserAccessor.User = new ClaimsPrincipal(new ClaimsIdentity(new ClaimsIdentity()));

        await target.LogoutAsync(TestMode); // Act

        RestClientCalls.Should().BeEmpty();
        setupUserServiceClient.VerifyWithAnyArgs(c => c.SetupAnonymousUserAsync(default), Times.Never);
        claimsCache.VerifyWithAnyArgs(c => c.RemoveAsync(default, default), Times.Never);
    }

    [Fact]
    public async Task ShouldClear_EvenIfExceptionHappens()
    {
        var ex = new Exception("Network error");
        RestClient.SetupWithAnyArgs(c => c.Execute(default, null, null)).Throws(ex);

        var act = async () => await target.LogoutAsync(TestMode);

        (await act.Should().ThrowAsync<Exception>()).SameAs(ex);
        setupUserServiceClient.Verify(c => c.SetupAnonymousUserAsync(TestMode));
        claimsCache.Verify(c => c.RemoveAsync(TestMode, new PosApiAuthTokens("user-id", "session-id")));
    }
}
