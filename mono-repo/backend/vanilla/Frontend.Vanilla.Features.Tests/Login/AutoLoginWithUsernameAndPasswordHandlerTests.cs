using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Features.Authentication;
using Frontend.Vanilla.Features.Login;
using Frontend.Vanilla.ServiceClients.Services.Authentication.Login;
using Frontend.Vanilla.Testing;
using Frontend.Vanilla.Testing.Fakes;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Primitives;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Login;

public class AutoLoginWithUsernameAndPasswordHandlerTests
{
    private readonly IAutoLoginHandler target;
    private readonly Mock<IWebAuthenticationService> authenticationService;
    private readonly Mock<HttpRequest> request;
    private TestLogger<AutoLoginWithUsernameAndPasswordHandler> log;

    private readonly Dictionary<string, StringValues> query;
    private readonly CancellationToken ct;

    public AutoLoginWithUsernameAndPasswordHandlerTests()
    {
        authenticationService = new Mock<IWebAuthenticationService>();
        var authConfig = new Mock<IAuthenticationConfiguration>();
        log = new TestLogger<AutoLoginWithUsernameAndPasswordHandler>();

        target = new AutoLoginWithUsernameAndPasswordHandler(authenticationService.Object, authConfig.Object, log);

        query = new Dictionary<string, StringValues>
        {
            { "name", "usr123" },
            { "pwd", "456" },
            { "foo", "bar" },
        };
        authConfig.SetupGet(c => c.AutoLoginQueryParameters).Returns(new AutoLoginQueryKeysConfiguration("name", "pwd"));
        ct = TestCancellationToken.Get();
        request = new Mock<HttpRequest>();
        request.SetupGet(r => r.Query).Returns(new QueryCollection(query));
    }

    private Func<Task> Act => () => target.TryLoginAsync(request.Object, ct);

    [Fact]
    public void UsedQueryKeys_ShouldEqualToConfiguredParameters()
        => target.UsedQueryKeys.Should().BeEquivalentTo(new[] { "name", "pwd" }.AsTrimmed())
            .And.NotBeSameAs(target.UsedQueryKeys, "should be taken from config just-in-time");

    [Fact]
    public async Task TryLoginAsync_ShouldLogin()
    {
        await Act();

        authenticationService.Verify(s => s.LoginAsync(It.IsAny<LoginParameters>(), ct));
        authenticationService.Invocations.Single().Arguments[0].Should().BeEquivalentTo(new LoginParameters("usr123", "456"));
    }

    [Fact]
    public async Task TryLoginAsync_ShouldLogException()
    {
        var loginEx = new Exception("Login failed");
        authenticationService.Setup(s => s.LoginAsync(It.IsAny<LoginParameters>(), ct)).ThrowsAsync(loginEx);

        await Act();

        log.Logged.Single().Verify(
            LogLevel.Error,
            loginEx,
            ("KeysUsername", "name"),
            ("Username", "usr123"));
    }

    [Theory]
    [InlineData(null, "456")]
    [InlineData("", "456")]
    [InlineData("  ", "456")]
    [InlineData("usr123", null)]
    [InlineData("usr123", "")]
    [InlineData("usr123", "  ")]
    [InlineData(null, "  ")]
    public void TryLoginAsync_ShouldReturnNullTask_IfEmptyOneOfQueryParameters(string username, string password)
    {
        query.SetOrRemove("name", username);
        query.SetOrRemove("pwd", password);

        var task = Act();

        task.Should().BeNull();
        authenticationService.VerifyNoOtherCalls();
    }
}
