using System.Collections.Generic;
using System.Threading.Tasks;
using Frontend.Vanilla.Features.Middleware;
using Frontend.Vanilla.Features.TrackerId;
using Frontend.Vanilla.Features.WebUtilities;
using Frontend.Vanilla.ServiceClients.Services.Crm;
using Frontend.Vanilla.ServiceClients.Services.Crm.MappedQuery;
using Frontend.Vanilla.Testing;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Primitives;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Middleware;

public class PosApiMapQueryMiddlewareTests
{
    private Features.WebAbstractions.Middleware target;
    private Mock<RequestDelegate> next;
    private Mock<IEndpointMetadata> endpointMetadata;
    private Mock<IPosApiCrmServiceInternal> posApiCrmService;
    private Mock<ITrackerIdConfiguration> trackerIdConfig;
    private DefaultHttpContext httpContext;

    public PosApiMapQueryMiddlewareTests()
    {
        next = new Mock<RequestDelegate>();
        endpointMetadata = new Mock<IEndpointMetadata>();
        posApiCrmService = new Mock<IPosApiCrmServiceInternal>();
        trackerIdConfig = new Mock<ITrackerIdConfiguration>();
        target = new PosApiMapQueryMiddleware(next.Object, endpointMetadata.Object, posApiCrmService.Object, trackerIdConfig.Object);

        httpContext = new DefaultHttpContext
        {
            RequestAborted = TestContext.Current.CancellationToken,
            Request =
            {
                Query = new QueryCollection(new Dictionary<string, StringValues> { ["test"] = "1" }),
            },
        };
        endpointMetadata.Setup(m => m.Contains<ServesHtmlDocumentAttribute>()).Returns(true);
    }

    private Task Act() => target.InvokeAsync(httpContext);

    [Fact]
    public async Task ShouldRedirect()
    {
        trackerIdConfig.Setup(x => x.BtagCallEnabled).Returns(true);
        httpContext.Request.Path = "/path";
        posApiCrmService.Setup(o => o.MapQueryAsync(TestContext.Current.CancellationToken, It.IsAny<Dictionary<string, StringValues>>(), false)).ReturnsAsync(new MappedQueryResult
            { Modified = true, Query = new Dictionary<string, StringValues> { ["foo"] = "bar" } });

        await Act();

        httpContext.Response.VerifyRedirect("/path?foo=bar");
        next.VerifyNoOtherCalls();
    }

    [Fact]
    public async Task ShouldNotDoAnything_IfNotServingHtml()
    {
        endpointMetadata.Setup(m => m.Contains<ServesHtmlDocumentAttribute>()).Returns(false);

        await Act();

        next.Verify(n => n(httpContext));
    }

    [Fact]
    public async Task ShouldNotDoAnything_IfNoQuery()
    {
        httpContext.Request.Query = new QueryCollection();

        await Act();

        next.Verify(n => n(httpContext));
    }

    [Fact]
    public async Task ShouldDoNohing_IfNoModification()
    {
        posApiCrmService.Setup(o => o.MapQueryAsync(TestContext.Current.CancellationToken, It.IsAny<Dictionary<string, StringValues>>(), false)).ReturnsAsync(new MappedQueryResult { Modified = false });

        await Act();

        next.Verify(n => n(httpContext));
    }

    [Fact]
    public async Task ShouldNotDoAnything_IfBtagCallDisabled()
    {
        trackerIdConfig.Setup(x => x.BtagCallEnabled).Returns(false);
        endpointMetadata.Setup(m => m.Contains<ServesHtmlDocumentAttribute>()).Returns(false);

        await Act();

        next.Verify(n => n(httpContext));
    }
}
