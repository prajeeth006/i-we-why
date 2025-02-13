using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Features.Authentication;
using Frontend.Vanilla.Features.Cookies;
using Frontend.Vanilla.Features.Login;
using Frontend.Vanilla.Features.NativeApp;
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

public class AutoLoginWithSsoTokenHandlerTests
{
    private readonly IAutoLoginHandler target;
    private readonly Mock<IWebAuthenticationService> authenticationService;
    private readonly Mock<INativeAppService> nativeAppService;
    private readonly Mock<ICookieHandler> cookieHandler;
    private readonly Mock<HttpRequest> request;
    private readonly TestLogger<AutoLoginWithSsoTokenHandler> log;

    private readonly Dictionary<string, StringValues> query;
    private readonly CancellationToken ct;

    public AutoLoginWithSsoTokenHandlerTests()
    {
        authenticationService = new Mock<IWebAuthenticationService>();
        nativeAppService = new Mock<INativeAppService>();
        cookieHandler = new Mock<ICookieHandler>();
        log = new TestLogger<AutoLoginWithSsoTokenHandler>();

        target = new AutoLoginWithSsoTokenHandler(authenticationService.Object, nativeAppService.Object, cookieHandler.Object, log);

        query = new Dictionary<string, StringValues>
        {
            { AutoLoginWithSsoTokenHandler.QueryKey, "wtf" },
            { AutoLoginWithSsoTokenHandler.LoginTypeQueryKey, "word" },
            { AutoLoginWithSsoTokenHandler.TerminalIdQueryKey, "terminal1" },
            { AutoLoginWithSsoTokenHandler.ShopIdQueryKey, "shop1" },
            { "foo", "bar" },
        };
        ct = TestCancellationToken.Get();
        request = new Mock<HttpRequest>();
        request.SetupGet(r => r.Query).Returns(new QueryCollection(query));
        request.SetupGet(r => r.Headers).Returns(Mock.Of<IHeaderDictionary>());
        request.SetupGet(r => r.Cookies).Returns(Mock.Of<IRequestCookieCollection>());
        nativeAppService.Setup(o => o.GetCurrentDetails()).Returns(new NativeAppDetails("sports", "sports", NativeAppMode.Native.ToString()));
    }

    private Func<Task> Act => () => target.TryLoginAsync(request.Object, ct);

    [Fact]
    public void UsedQueryKeys_ShouldEqualToSso()
        => target.UsedQueryKeys.Should().BeEquivalentTo(new[] { AutoLoginWithSsoTokenHandler.QueryKey }.AsTrimmed())
            .And.BeSameAs(target.UsedQueryKeys, "should be singleton");

    [Theory]
    [InlineData(NativeAppMode.Unknown, null)]
    [InlineData(NativeAppMode.Native, "SPORTS")]
    [InlineData(NativeAppMode.DownloadClientWrapper, "SPORTS")]
    public async Task TryLoginAsync_ShouldLogin(NativeAppMode nativeAppMode, string expectedProductId)
    {
        nativeAppService.Setup(o => o.GetCurrentDetails()).Returns(new NativeAppDetails("SPORTS", "SPORTS", nativeAppMode.ToString()));

        await Act();

        authenticationService.Verify(s => s.LoginAsync(It.IsAny<AutoLoginParameters>(), ct));
        authenticationService.Invocations.Single().Arguments[0].Should().BeEquivalentTo(
            new AutoLoginParameters("wtf")
                { InvokersProductId = expectedProductId, LoginType = "word", TerminalId = "terminal1", ShopId = "shop1" });
    }

    [Fact]
    public async Task TryLoginAsync_ShouldLoginWithHeaderSso()
    {
        request.SetupGet(r => r.Headers)
            .Returns(new HeaderDictionary(new Dictionary<string, StringValues> { [HttpHeaders.Sso] = new ("sso-from-header") }));

        await Act();

        authenticationService.Verify(s => s.LoginAsync(It.IsAny<AutoLoginParameters>(), ct));
        authenticationService.Invocations.Single().Arguments[0].Should().BeEquivalentTo(
            new AutoLoginParameters("sso-from-header")
                { InvokersProductId = "SPORTS", LoginType = "word", TerminalId = "terminal1", ShopId = "shop1" });
    }

    [Fact]
    public async Task TryLoginAsync_ShouldLoginWithCookieSsoToken()
    {
        cookieHandler.Setup(r => r.GetValue(CookieConstants.SsoTokenCrossDomain)).Returns("sso-from-cookie");

        await Act();

        cookieHandler.Verify(r => r.Delete(CookieConstants.SsoTokenCrossDomain, null));
        authenticationService.Verify(s => s.LoginAsync(It.IsAny<AutoLoginParameters>(), ct));
        authenticationService.Invocations.Single().Arguments[0].Should().BeEquivalentTo(
            new AutoLoginParameters("sso-from-cookie")
                { InvokersProductId = "SPORTS", LoginType = "word", TerminalId = "terminal1", ShopId = "shop1" });
    }

    [Fact]
    public async Task TryLoginAsync_ShouldLogException()
    {
        request.SetupGet(r => r.Headers)
            .Returns(new HeaderDictionary(new Dictionary<string, StringValues> { [HttpHeaders.Sso] = new ("sso-from-header") }));
        cookieHandler.Setup(r => r.GetValue(CookieConstants.SsoTokenCrossDomain)).Returns("sso-from-cookie");
        var loginEx = new Exception("Login failed");
        authenticationService.Setup(s => s.LoginAsync(It.IsAny<AutoLoginParameters>(), ct)).ThrowsAsync(loginEx);

        await Act();

        cookieHandler.Verify(r => r.Delete(CookieConstants.SsoTokenCrossDomain, null));
        log.Logged.Single().Verify(LogLevel.Error,
            loginEx,
            ("SsoToken", "sso-from-header"),
            ("HeaderKey", "x-sso"),
            ("CookieKey", "ssoTokenCrossDomain"),
            ("QueryKey", AutoLoginWithSsoTokenHandler.QueryKey),
            ("HeaderValue", "sso-from-header"),
            ("CookieValue", "sso-from-cookie"),
            ("QueryValue", "wtf"));
    }

    [Theory, ValuesData(null, "", "  ")]
    public void TryLoginAsync_ShouldReturnNullTask_IfEmptyQueryParameter(string value)
    {
        query.SetOrRemove(AutoLoginWithSsoTokenHandler.QueryKey, value);

        var task = Act();

        task.Should().BeNull();
        authenticationService.VerifyNoOtherCalls();
        nativeAppService.VerifyNoOtherCalls();
    }
}
