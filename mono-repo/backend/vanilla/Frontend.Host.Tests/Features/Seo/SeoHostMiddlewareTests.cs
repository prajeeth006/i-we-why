using FluentAssertions;
using Frontend.Host.App.Contracts;
using Frontend.Host.Features.HttpForwarding;
using Frontend.Host.Features.PrettyUrls;
using Frontend.Host.Features.Seo;
using Frontend.Host.Features.UrlTransformation;
using Frontend.Vanilla.Core.Abstractions;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Features.Globalization;
using Frontend.Vanilla.Features.Hosting;
using Frontend.Vanilla.Features.WebAbstractions;
using Frontend.Vanilla.Features.WebUtilities;
using Frontend.Vanilla.Testing.Fakes;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.Extensions.Logging;
using Moq;
using System.Net;
using System.Net.Http;
using Xunit;

namespace Frontend.Host.Tests.Features.PrettyUrls
{
    public class SeoHostMiddlewareTests
    {
        private Middleware target;
        private Mock<RequestDelegate> next;
        private Mock<IEndpointMetadata> endpointMetadata;
        private Mock<IProductApiHttpClient> productApiHttpClient;
        private Mock<ILanguageService> languageService;
        private SeoHostConfiguration config;
        private TestLogger<SeoHostMiddleware> log;

        private readonly CancellationToken cancellationToken;
        private DefaultHttpContext ctx;

        public SeoHostMiddlewareTests()
        {
            next = new Mock<RequestDelegate>();
            endpointMetadata = new Mock<IEndpointMetadata>();
            productApiHttpClient = new Mock<IProductApiHttpClient>();
            languageService = new Mock<ILanguageService>();
            config = new SeoHostConfiguration
            {
                IsEnabled = true,
            };
            log = new TestLogger<SeoHostMiddleware>();
            target = new SeoHostMiddleware(productApiHttpClient.Object, endpointMetadata.Object, languageService.Object, config, log, next.Object);

            cancellationToken = TestCancellationToken.Get();
            languageService.Setup(l => l.Current).Returns(TestLanguageInfo.Get("en", routeValue: "en"));

            ctx = new DefaultHttpContext();
            ctx.Request.Scheme = "http";
            ctx.Request.Host = new HostString("http://www.bwin.com");
            ctx.Request.Path = "/en/page";

            endpointMetadata.Setup(m => m.Contains<ServesHtmlDocumentAttribute>()).Returns(true);
        }

        [Fact]
        public async Task ShouldReturnSeoRedirectResponse()
        {
            var redirectResponse = new RedirectResponseMetadata(301, "https://www.bwin.com/en/sports/seoredirected", null, "StatusCode", "StatusReason");
            productApiHttpClient.Setup(x => x.GetFromJsonAsync<RedirectResponseMetadata>(ProductApi.Sports, It.IsAny<string>(), It.IsAny<CancellationToken>())).Returns(Task.FromResult(redirectResponse)!);
            await target.InvokeAsync(ctx);
            ctx.Response.Headers.GetValue("Location").ToString().Should().Be(redirectResponse.Location);
            ctx.Response.Headers.GetValue("X-Status-Source").ToString().Should().Be(redirectResponse.StatusSource);
            ctx.Response.Headers.GetValue("X-Status-Reason").ToString().Should().Be(redirectResponse.StatusReason);
            ctx.Response.Headers.GetValue("X-Redirect-Source").ToString().Should().Be(typeof(SeoHostMiddleware).FullName);
            ctx.Response.StatusCode.Should().Be(redirectResponse.StatusCode);
        }

        [Fact]
        public async Task ShouldSkipWhenDisabled()
        {
            config.IsEnabled = false;
            await target.InvokeAsync(ctx);
            productApiHttpClient.VerifyNoOtherCalls();
        }
    }
}
