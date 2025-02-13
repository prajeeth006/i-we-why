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
using Frontend.Vanilla.Testing.Xunit;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Primitives;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Login;

public class AutoLoginWithTempTokenHandlerTests
{
    private readonly IAutoLoginHandler target;
    private readonly Mock<IWebAuthenticationService> authenticationService;
    private readonly Mock<HttpRequest> request;
    private readonly TestLogger<AutoLoginWithTempTokenHandler> log;

    private readonly Dictionary<string, StringValues> query;
    private readonly CancellationToken ct;

    public AutoLoginWithTempTokenHandlerTests()
    {
        authenticationService = new Mock<IWebAuthenticationService>();
        var authConfig = new Mock<IAuthenticationConfiguration>();
        log = new TestLogger<AutoLoginWithTempTokenHandler>();

        target = new AutoLoginWithTempTokenHandler(authenticationService.Object, authConfig.Object, log);

        query = new Dictionary<string, StringValues>
        {
            { AutoLoginWithTempTokenHandler.QueryKeys.Username, "usr123" },
            { AutoLoginWithTempTokenHandler.QueryKeys.TempToken, "tmp456" },
            { AutoLoginWithTempTokenHandler.QueryKeys.ClientPlatform, "telebet" },
            { "foo", "bar" },
        };
        authConfig.SetupGet(c => c.ClientPlatformToChannel).Returns(new Dictionary<string, string>
        {
            { "telebet", "TB" },
        });
        ct = TestCancellationToken.Get();
        request = new Mock<HttpRequest>();
        request.SetupGet(r => r.Query).Returns(new QueryCollection(query));
    }

    private Func<Task> Act => () => target.TryLoginAsync(request.Object, ct);

    [Fact]
    public void UsedQueryKeys_ShouldEqualToSso()
        => target.UsedQueryKeys.Should().BeEquivalentTo(new[]
            {
                AutoLoginWithTempTokenHandler.QueryKeys.Username,
                AutoLoginWithTempTokenHandler.QueryKeys.TempToken,
                AutoLoginWithTempTokenHandler.QueryKeys.ClientPlatform,
            }.AsTrimmed())
            .And.BeSameAs(target.UsedQueryKeys, "should be singleton");

    [Fact]
    public async Task TryLoginAsync_ShouldLogin()
    {
        await Act();

        authenticationService.Verify(s => s.LoginAsync(It.IsAny<LoginParameters>(), ct));
        authenticationService.Invocations.Single().Arguments[0].Should().BeEquivalentTo(new LoginParameters("usr123", " ")
        {
            LoginType = AutoLoginWithTempTokenHandler.LoginType,
            RequestData = { { AutoLoginWithTempTokenHandler.TempTokenKey, "tmp456" } },
            ChannelId = "TB",
        });
    }

    [Theory, ValuesData(null, "notConfigured")]
    public async Task TryLoginAsync_ShouldHandleNotFoundPlatform(string platformQuery)
    {
        query.SetOrRemove(AutoLoginWithTempTokenHandler.QueryKeys.ClientPlatform, platformQuery);

        await Act();

        ((LoginParameters)authenticationService.Invocations.Single().Arguments[0]).ChannelId.Should().BeNull();
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
            ("QueryKeysUsername", AutoLoginWithTempTokenHandler.QueryKeys.Username),
            ("Username", "usr123"),
            ("QueryKeysTempToken", AutoLoginWithTempTokenHandler.QueryKeys.TempToken),
            ("TempToken", "tmp456"));
    }

    [Theory]
    [InlineData(null, "tmp456")]
    [InlineData("", "tmp456")]
    [InlineData("  ", "tmp456")]
    [InlineData("usr123", null)]
    [InlineData("usr123", "")]
    [InlineData("usr123", "  ")]
    [InlineData(null, "  ")]
    public void TryLoginAsync_ShouldReturnNullTask_IfEmptyOneOfQueryParameters(string username, string tempToken)
    {
        query.SetOrRemove(AutoLoginWithTempTokenHandler.QueryKeys.Username, username);
        query.SetOrRemove(AutoLoginWithTempTokenHandler.QueryKeys.TempToken, tempToken);

        var task = Act();

        task.Should().BeNull();
        authenticationService.VerifyNoOtherCalls();
    }
}
