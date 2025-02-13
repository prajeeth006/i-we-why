using FluentAssertions;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.DslProviders;
using Microsoft.AspNetCore.Http;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.DslProviders;

public sealed class RequestHeadersDslProviderTests
{
    private IRequestHeadersDslProvider target;
    private HeaderDictionary headers;

    public RequestHeadersDslProviderTests()
    {
        headers = new HeaderDictionary();
        var httpContextAccessor = Mock.Of<IHttpContextAccessor>(r => r.HttpContext.Request.Headers == headers);
        target = new RequestHeadersDslProvider(httpContextAccessor);
    }

    [Fact]
    public void ShouldGetHeader()
    {
        headers["X-Test"] = "Foo";

        // Act & assert
        target.Get("X-Test").Should().Be("Foo");
    }

    [Fact]
    public void ShouldGetEmpty_IfNoHeader()
        => target.Get("X-Test").Should().BeEmpty(); // Act & assert

    [Fact]
    public void UserAgent_ShouldGetHeader()
    {
        headers[HttpHeaders.UserAgent] = "Netscape Navigator";

        // Act & assert
        target.UserAgent.Should().Be("Netscape Navigator");
    }
}
