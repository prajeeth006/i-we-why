using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.Diagnostics;
using Frontend.Vanilla.Core.IO;
using Frontend.Vanilla.Core.Net;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.Features.Diagnostics.HealthPages.AssetsHandling;
using Frontend.Vanilla.Testing;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Moq;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Primitives;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Diagnostics.HealthPages.AssetsHandling;

public class HealthAssetsMiddlewareTests
{
    private Mock<IInternalRequestEvaluator> internalRequestEvaluator;
    private Mock<IAssemblyFileProvider> fileProvider;
    private Assembly assembly;

    private DefaultHttpContext httpContext;
    private Mock<RequestDelegate> next;
    private Mock<Stream> fileStream;
    private List<IDiagnosticInfoProvider> infoProviders = Enumerable.Empty<IDiagnosticInfoProvider>().ToList();

    public HealthAssetsMiddlewareTests()
    {
        internalRequestEvaluator = new Mock<IInternalRequestEvaluator>();
        fileProvider = new Mock<IAssemblyFileProvider>();
        assembly = TestAssembly.Get(infoVersion: "1.2.3");

        next = new Mock<RequestDelegate>();
        fileStream = new Mock<Stream>();
        httpContext = new DefaultHttpContext();

        httpContext.Request.Method = "GET";
        httpContext.Request.Path = "/health/_foo/bar.txt";
        httpContext.Response.Body = new MemoryStream();

        internalRequestEvaluator.Setup(e => e.IsInternal()).Returns(true);
        fileProvider.SetupWithAnyArgs(p => p.GetFileStream(null, null)).Returns(fileStream.Object);
        fileStream.SetupGet(s => s.Length).Returns(77);
    }

    private Task Act()
    {
        var target = new HealthAssetsMiddleware(next.Object, fileProvider.Object, assembly, infoProviders, new RelativePath("root/dir"));

        return target.InvokeAsync(httpContext);
    }

    [Fact]
    public Task ShouldServeRequestedFile_IfLeadingUnderscore()
        => RunServeFileTest("root/dir\\_foo/bar.txt", ContentTypes.Text);

    [Fact]
    public async Task ShouldServeIndexHtml_IfLogUrl()
    {
        httpContext.Request.Path = "/health/log";
        await RunServeFileTest("root/dir\\index.html", ContentTypes.Html);
    }

    private async Task RunServeFileTest(string expectedFilePath, string expectedContentType)
    {
        // Skipped for linux becaause is not invoking p.GetFileStream
        if (OperatingSystem.IsWindows())
        {
            await Act();

            httpContext.Response.StatusCode.Should().Be(StatusCodes.Status200OK);
            httpContext.Response.Headers.Should().BeEquivalentTo(new Dictionary<string, StringValues>
            {
                { HttpHeaders.CacheControl, "public" },
                { HttpHeaders.ETag, @"""1.2.3""" },
                { HttpHeaders.ContentLength, "77" },
                { HttpHeaders.ContentType, expectedContentType },
            });

            fileStream.Verify(s => s.CopyToAsync(httpContext.Response.Body, StreamExtensions.CopyBufferSize, httpContext.RequestAborted));
            fileStream.Verify(s => s.Close());
            fileProvider.Verify(p => p.GetFileStream(assembly, new RelativePath(expectedFilePath)));
            next.VerifyNoOtherCalls();
        }
    }

    [Fact]
    public async Task ShouldReturnNotFound_IfFileNotExist()
    {
        fileProvider.SetupWithAnyArgs(p => p.GetFileStream(null, null)).Returns(() => null);
        await RunErrorMessageTest(StatusCodes.Status404NotFound, HealthAssetsMiddleware.FileNotFoundMessage, fileProviderCalls: 1);
    }

    private async Task RunErrorMessageTest(int expectedCode, string expectedMsg, int fileProviderCalls = 0)
    {
        await Act();

        httpContext.Response.StatusCode.Should().Be(expectedCode);
        httpContext.Response.VerifyBody(ContentTypes.Text, expectedMsg);
        fileProvider.Invocations.Should().HaveCount(fileProviderCalls);
        next.VerifyNoOtherCalls();
    }

    [Fact]
    public async Task ShouldReturnNotModified_IfFileNotChanged()
    {
        httpContext.Request.Headers[HttpHeaders.IfNoneMatch] = @"""1.2.3""";
        await RunOnlyHttpCodeTest(StatusCodes.Status304NotModified);
    }

    private async Task RunOnlyHttpCodeTest(int expectedCode)
    {
        await Act();

        httpContext.Response.StatusCode.Should().Be(expectedCode);
        httpContext.Response.Headers.Should().BeEmpty();
        httpContext.Response.VerifyEmptyBody();
        fileProvider.VerifyNoOtherCalls();
        next.VerifyNoOtherCalls();
    }

    [Fact]
    public async Task ShouldUseRandomETag_IfLocalDevelopment()
    {
        assembly = TestAssembly.Get(infoVersion: null);

        await Act();

        httpContext.Response.Headers[HttpHeaders.ETag].ToString().Should().MatchRegex(@"^""\w{8}-\w{4}-\w{4}-\w{4}-\w{12}\""$");
    }

    [Theory]
    [InlineData("/health")]
    [InlineData("/health/")]
    [InlineData("/")]
    [InlineData("/en/page")]
    public async Task ShouldNotExecute_IfDifferentPath(string requestPath)
    {
        httpContext.Request.Path = requestPath;

        await Act();

        next.Verify(n => n(httpContext));
        httpContext.Response.VerifyNotChanged();
    }
}
