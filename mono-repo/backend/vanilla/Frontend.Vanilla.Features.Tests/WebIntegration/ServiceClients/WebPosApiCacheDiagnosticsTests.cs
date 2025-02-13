using System;
using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.Features.WebIntegration.ServiceClients;
using Frontend.Vanilla.ServiceClients.Infrastructure.Caching;
using Microsoft.AspNetCore.Http;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.WebIntegration.ServiceClients;

public class WebPosApiCacheDiagnosticsTests
{
    [Fact]
    public void ShouldAddRequestUrl()
    {
        var innerInfo = new Dictionary<string, object> { { "Diagnostics", "Info" } };
        var inner = Mock.Of<IPosApiCacheDiagnostics>(d => d.GetInfo() == innerInfo);
        var httpContextAccessor = new Mock<IHttpContextAccessor>();
        IPosApiCacheDiagnostics target = new WebPosApiCacheDiagnostics(inner, httpContextAccessor.Object);

        httpContextAccessor.SetupGet(a => a.HttpContext.Request.Scheme).Returns("http");
        httpContextAccessor.SetupGet(a => a.HttpContext.Request.Host).Returns(new HostString("bwin.com"));
        httpContextAccessor.SetupGet(a => a.HttpContext.Request.Path).Returns("/en/page");
        httpContextAccessor.SetupGet(a => a.HttpContext.Request.QueryString).Returns(new QueryString("?q=1"));

        // Act
        var result = target.GetInfo();

        result.Should().BeSameAs(innerInfo)
            .And.BeEquivalentTo(new Dictionary<string, object>
            {
                { "Url", new Uri("http://bwin.com/en/page?q=1") },
                { "Diagnostics", "Info" },
            });
    }
}
