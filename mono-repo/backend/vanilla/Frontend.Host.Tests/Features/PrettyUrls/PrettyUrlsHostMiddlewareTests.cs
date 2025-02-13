using FluentAssertions;
using Frontend.Host.App.Contracts;
using Frontend.Host.Features.HttpForwarding;
using Frontend.Host.Features.PrettyUrls;
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
using Xunit;

namespace Frontend.Host.Tests.Features.PrettyUrls
{
    public class PrettyUrlsHostMiddlewareTests
    {
        private Middleware target;
        private Mock<RequestDelegate> next;
        private Mock<IEndpointMetadata> endpointMetadata;
        private Mock<IProductApiHttpClient> productApiHttpClient;
        private Mock<ILanguageService> languageService;
        private PrettyUrlsHostConfiguration config;
        private TestLogger<PrettyUrlsHostMiddleware> log;

        private readonly CancellationToken cancellationToken;
        private DefaultHttpContext ctx;

        public PrettyUrlsHostMiddlewareTests()
        {
            next = new Mock<RequestDelegate>();
            endpointMetadata = new Mock<IEndpointMetadata>();
            productApiHttpClient = new Mock<IProductApiHttpClient>();
            languageService = new Mock<ILanguageService>();
            config = new PrettyUrlsHostConfiguration
            {
                IsEnabled = true,
            };
            log = new TestLogger<PrettyUrlsHostMiddleware>();
            target = new PrettyUrlsHostMiddleware(productApiHttpClient.Object, endpointMetadata.Object, languageService.Object, config, next.Object, log);

            cancellationToken = TestCancellationToken.Get();
            languageService.Setup(l => l.Current).Returns(TestLanguageInfo.Get("es-ES", routeValue: "es"));

            ctx = new DefaultHttpContext();
            ctx.Request.Scheme = "http";
            ctx.Request.Host = new HostString("http://www.bwin.com");
            ctx.Request.Path = "/en/page";

            endpointMetadata.Setup(m => m.Contains<ServesHtmlDocumentAttribute>()).Returns(true);
        }

        [Fact]
        public async Task ShouldReturnTranslatedResponse()
        {
            var translatedResponse = new RedirectResponseMetadata(301, "https://www.bwin.com/es/translated", null, GetType().Name);
            productApiHttpClient.Setup(x => x.GetFromJsonAsync<RedirectResponseMetadata>(ProductApi.Sports, It.IsAny<string>(), It.IsAny<CancellationToken>())).Returns(Task.FromResult(translatedResponse)!);
            await target.InvokeAsync(ctx);
            ctx.Response.Headers.GetValue("Location").ToString().Should().Be(translatedResponse.Location);
            ctx.Response.StatusCode.Should().Be(translatedResponse.StatusCode);
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
