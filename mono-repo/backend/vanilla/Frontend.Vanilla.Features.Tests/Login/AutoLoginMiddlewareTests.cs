using System;
using System.Threading.Tasks;
using Frontend.Vanilla.Features.Cookies;
using Frontend.Vanilla.Features.Login;
using Frontend.Vanilla.Features.WebUtilities;
using Frontend.Vanilla.Testing;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Xunit;
using Microsoft.AspNetCore.Http;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Login;

public class AutoLoginMiddlewareTests
{
    private Features.WebAbstractions.Middleware target;
    private Mock<RequestDelegate> next;
    private Mock<IAutoLoginHandler> loginHandler;
    private Mock<IEndpointMetadata> endpointMetadata;
    private DefaultHttpContext httpContext;

    public AutoLoginMiddlewareTests()
    {
        next = new Mock<RequestDelegate>();
        loginHandler = new Mock<IAutoLoginHandler>();
        endpointMetadata = new Mock<IEndpointMetadata>();
        target = new AutoLoginMiddleware<IAutoLoginHandler>(next.Object, loginHandler.Object, endpointMetadata.Object);

        httpContext = new DefaultHttpContext();
        httpContext.Request.Scheme = "https";
        httpContext.Request.Host = new HostString("www.coral.co.uk");
        httpContext.Request.Path = "/transaction-history";
        httpContext.Request.QueryString = new QueryString("?q=1&user=batman&pwd=123&p=2");
        endpointMetadata.Setup(m => m.Contains<ServesHtmlDocumentAttribute>()).Returns(true);
        loginHandler.SetupGet(h => h.UsedQueryKeys).Returns(new[] { "user", "pwd" }.AsTrimmed());
    }

    private Task Act() => target.InvokeAsync(httpContext);

    [Fact]
    public async Task ShouldLogin_IfQueryStringNotEmpty()
    {
        var loginTask = new Mock<Action>();
        loginHandler.Setup(h => h.TryLoginAsync(httpContext.Request, httpContext.RequestAborted)).Returns(async () =>
        {
            await Task.Yield(); // Make sure task is awaited
            loginTask.Object.Invoke();
        });

        await Act();

        httpContext.Response.VerifyRedirect("/transaction-history?q=1&p=2");
        loginTask.Verify(t => t());
        next.VerifyNoOtherCalls();
    }

    [Fact]
    public async Task ShouldLogin_IfSsoHeader()
    {
        httpContext.Request.QueryString = new QueryString(null);
        httpContext.Request.Headers.Append("X-SSO", "batman");
        var loginTask = new Mock<Action>();
        loginHandler.Setup(h => h.TryLoginAsync(httpContext.Request, httpContext.RequestAborted)).Returns(async () =>
        {
            await Task.Yield(); // Make sure task is awaited
            loginTask.Object.Invoke();
        });

        await Act();

        httpContext.Response.VerifyRedirect("/transaction-history");
        loginTask.Verify(t => t());
        next.VerifyNoOtherCalls();
    }

    [Fact]
    public async Task ShouldLogin_IfSsoTokenCookie()
    {
        httpContext.Request.QueryString = new QueryString(null);
        httpContext.Request.Cookies = Mock.Of<IRequestCookieCollection>(c => c.ContainsKey(CookieConstants.SsoTokenCrossDomain) == true);
        var loginTask = new Mock<Action>();
        loginHandler.Setup(h => h.TryLoginAsync(httpContext.Request, httpContext.RequestAborted)).Returns(async () =>
        {
            await Task.Yield(); // Make sure task is awaited
            loginTask.Object.Invoke();
        });

        await Act();

        httpContext.Response.VerifyRedirect("/transaction-history");
        loginTask.Verify(t => t());
        next.VerifyNoOtherCalls();
    }

    [Fact]
    public async Task ShouldOnlyTry_IfNotLoginTask()
    {
        loginHandler.Setup(h => h.TryLoginAsync(httpContext.Request, httpContext.RequestAborted)).Returns(() => null);

        await Act();

        next.Verify(n => n(httpContext));
        httpContext.Response.VerifyNotChanged();
        loginHandler.Verify(h => h.TryLoginAsync(httpContext.Request, httpContext.RequestAborted));
        loginHandler.VerifyGet(h => h.UsedQueryKeys, Times.Never);
    }

    [Theory, ValuesData(null, "", "?")]
    public async Task ShouldNotTryToLogin_IfEmptyQuery(string queryStr)
    {
        httpContext.Request.QueryString = new QueryString(queryStr);
        await RunNoTryLoginTest();
    }

    [Fact]
    public async Task ShouldNotTryToLogin_IfUserAlreadyAuthenticated()
    {
        httpContext.User = TestUser.Get(AuthState.Authenticated);
        await RunNoTryLoginTest();
    }

    [Fact]
    public async Task ShouldNotTryToLogin_IfNotHtmlDocument()
    {
        endpointMetadata.Setup(m => m.Contains<ServesHtmlDocumentAttribute>()).Returns(false);
        await RunNoTryLoginTest();
    }

    private async Task RunNoTryLoginTest()
    {
        await Act();

        next.Verify(n => n(httpContext));
        httpContext.Response.VerifyNotChanged();
        loginHandler.VerifyNoOtherCalls();
    }
}
