using System.IO;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Reflection;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.Features.Diagnostics.SiteVersion;
using Frontend.Vanilla.Testing;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Xunit;
using Microsoft.AspNetCore.Http;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Diagnostics.SiteVersion;

public class SiteVersionMiddlewareTests
{
    private Features.WebAbstractions.Middleware target;
    private Mock<RequestDelegate> next;
    private Mock<IDiagnosticsComponentProvider> versionProvider;

    private DefaultHttpContext httpContext;

    public SiteVersionMiddlewareTests()
    {
        next = new Mock<RequestDelegate>();
        versionProvider = new Mock<IDiagnosticsComponentProvider>();
        target = new SiteVersionMiddleware(next.Object, new VanillaVersion(12, 13, 14, 15, "hash"), versionProvider.Object);

        httpContext = new DefaultHttpContext();
        httpContext.RequestAborted = TestCancellationToken.Get();
        httpContext.Response.Body = new MemoryStream();
    }

    private Task Act() => target.InvokeAsync(httpContext);

    [Theory, ValuesData("/site/version/", "/SITE/versIOn")]
    public async Task ShouldServeSiteVersions(string requestPath)
    {
        versionProvider.SetupGet(p => p.Name).Returns("Test1");
        httpContext.Request.Path = requestPath;

        await Act();

        httpContext.Response.VerifyBody(ContentTypes.Text, "Test1 12.13.14.15-hash");
    }

    [Theory, ValuesData("/other", "/site", "/site/version/other")]
    public async Task ShouldCallNext_IfNotSiteVersionRequestUrl(string requestPath)
    {
        httpContext.Request.Path = requestPath;

        await Act();

        next.Verify(n => n(httpContext));
        httpContext.Response.VerifyNotChanged();
    }
}
