using System.Net;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.LicenseInfo;
using Frontend.Vanilla.Features.PlaceholderReplacers;
using Frontend.Vanilla.Features.WebUtilities;
using Frontend.Vanilla.Testing;
using Frontend.Vanilla.Testing.Moq;
using Microsoft.AspNetCore.Http;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.LicenseInfo;

public class LicenseInfoMiddlewareTests
{
    private Features.WebAbstractions.Middleware target;
    private Mock<RequestDelegate> next;
    private Mock<IEndpointMetadata> endpointMetadata;
    private Mock<ILicenseInfoServiceInternal> licenceInfoService;
    private Mock<IProductPlaceholderReplacer> productPlaceholderReplacer;
    private DefaultHttpContext httpContext;

    public LicenseInfoMiddlewareTests()
    {
        next = new Mock<RequestDelegate>();
        endpointMetadata = new Mock<IEndpointMetadata>();
        licenceInfoService = new Mock<ILicenseInfoServiceInternal>();
        productPlaceholderReplacer = new Mock<IProductPlaceholderReplacer>();
        httpContext = new DefaultHttpContext();
        target = new LicenseInfoMiddleware(next.Object, endpointMetadata.Object, licenceInfoService.Object, productPlaceholderReplacer.Object);
        endpointMetadata.Setup(m => m.Contains<ServesHtmlDocumentAttribute>()).Returns(true);
        productPlaceholderReplacer.SetupWithAnyArgs(x => x.ReplaceAsync(default, null)).ReturnsAsync((ExecutionMode m, string x) => x);
    }

    private Task Act() => target.InvokeAsync(httpContext);

    [Fact]
    public async Task ShouldRedirect()
    {
        licenceInfoService.Setup(o => o.GetLicenceComplianceAsync(ExecutionMode.Async(httpContext.RequestAborted))).ReturnsAsync(new LicenseInfoModel
        {
            AcceptanceNeeded = true,
            Licenses = "F_PLUS",
            RedirectUrl = "http://{portal}/url",
        });

        await Act();

        httpContext.Response.VerifyRedirect("http://{portal}/url");
        httpContext.Response.Headers.Should().Contain("X-LicenseInfo", "F_PLUS");
        next.VerifyNoOtherCalls();
    }

    [Fact]
    public async Task ShouldNotDoAnything_IfNotServingHtml()
    {
        endpointMetadata.Setup(m => m.Contains<ServesHtmlDocumentAttribute>()).Returns(false);
        await RunNoRedirectTest();
    }

    [Fact]
    public async Task ShouldNotDoAnything_IfThereAreNoAvailableLicences()
    {
        licenceInfoService.Setup(o => o.GetLicenceComplianceAsync(ExecutionMode.Async(httpContext.RequestAborted)))
            .ReturnsAsync(new LicenseInfoModel { AcceptanceNeeded = false });
        await RunNoRedirectTest(expectedServiceCalls: 1);
    }

    private async Task RunNoRedirectTest(int expectedServiceCalls = 0)
    {
        await Act();

        next.Verify(n => n(httpContext));
        httpContext.Response.StatusCode.Should().Be((int)HttpStatusCode.OK);
        licenceInfoService.Invocations.Should().HaveCount(expectedServiceCalls);
    }
}
