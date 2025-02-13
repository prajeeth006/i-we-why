using System.IO;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.Features.Diagnostics.SiteCheck;
using Frontend.Vanilla.Testing;
using Frontend.Vanilla.Testing.Xunit;
using Microsoft.AspNetCore.Http;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Diagnostics.SiteCheck;

public class SiteCheckMiddlewareTests
{
    private Features.WebAbstractions.Middleware target;
    private DefaultHttpContext httpContext;
    private Mock<RequestDelegate> next;

    public SiteCheckMiddlewareTests()
    {
        next = new Mock<RequestDelegate>();
        target = new SiteCheckMiddleware(next.Object);

        httpContext = new DefaultHttpContext();
        httpContext.Response.Body = new MemoryStream();
    }

    private Task Act() => target.InvokeAsync(httpContext);

    [Theory, ValuesData("/SITE/cheCK", "/site/check/")]
    public async Task ShouldServeSiteVersions(string requestPath)
    {
        httpContext.Request.Path = requestPath;

        await Act();

        httpContext.Response.VerifyBody(ContentTypes.Text, SiteCheckMiddleware.CheckOk);
    }

    [Theory, ValuesData("/other", "/site", "/site/check/other")]
    public async Task ShouldCallNext_IfNotSiteCheckUrl(string requestPath)
    {
        httpContext.Request.Path = requestPath;

        await Act();

        next.Verify(n => n(httpContext));
        httpContext.Response.VerifyNotChanged();
    }
}
