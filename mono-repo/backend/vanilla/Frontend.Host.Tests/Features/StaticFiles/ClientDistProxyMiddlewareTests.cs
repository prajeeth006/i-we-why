using ErrorOr;
using FluentAssertions;
using Frontend.Host.Features.ClientApp;
using Frontend.Host.Features.SiteRootFiles;
using Frontend.Host.Features.StaticFiles;
using Frontend.Vanilla.Testing.Fakes;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Extensions.Primitives;
using Moq;
using Xunit;

namespace Frontend.Host.Tests.Features.StaticFiles
{
    public class ClientDistProxyMiddlewareTests
    {
        private DefaultHttpContext httpContext;
        private ClientDistProxyMiddleware target;
        private Mock<RequestDelegate> next;
        private Mock<IClientAppService> clientAppService;
        private Mock<IContentTypeProvider> contentTypeProvider;
        private Mock<IStaticFilesConfiguration> staticFilesConfiguration;
        private TestLogger<ClientDistProxyMiddleware> log;

        public ClientDistProxyMiddlewareTests()
        {
            clientAppService = new Mock<IClientAppService>();
            contentTypeProvider = new Mock<IContentTypeProvider>();
            staticFilesConfiguration = new Mock<IStaticFilesConfiguration>();
            log = new TestLogger<ClientDistProxyMiddleware>();
            next = new Mock<RequestDelegate>();
            httpContext = new DefaultHttpContext();
            target = new ClientDistProxyMiddleware(next.Object, clientAppService.Object, contentTypeProvider.Object, staticFilesConfiguration.Object, log);

            clientAppService.Setup(x => x.GetAsync(It.IsAny<string>(), It.IsAny<CancellationToken>())).Returns(Task.FromResult(ErrorOrFactory.From(new HttpResponseMessage())));
            staticFilesConfiguration.SetupGet(x => x.Headers).Returns(new Dictionary<string, IDictionary<string, string>>()
            {
                {
                    "~partytown",
                    new Dictionary<string, string>
                    {
                        ["Cross-Origin-Embedder-Policy"] = "credentialless",
                        ["Cross-Origin-Opener-Policy"] = "same-origin",
                    }
                },
            });
        }

        [Fact]
        public async Task ShouldAddHCustomHeadersIfConfiguredForPath()
        {
            httpContext.Request.Path = "/~partytown.js";

            await target.InvokeAsync(httpContext);

            httpContext.Response.Headers.Should().BeEquivalentTo(new Dictionary<string, StringValues>
            {
                { "Cache-Control", "public,max-age=31536000" },
                { "Cross-Origin-Embedder-Policy", "credentialless" },
                { "Cross-Origin-Opener-Policy", "same-origin" },
            });
        }

        [Fact]
        public async Task ShouldNotAddCustomHeadersIfNotConfiguredForPath()
        {
            httpContext.Request.Path = "/test.js";

            await target.InvokeAsync(httpContext);

            httpContext.Response.Headers.Should().BeEquivalentTo(new Dictionary<string, StringValues>
            {
                { "Cache-Control", "public,max-age=31536000" },
            });
        }
    }
}
