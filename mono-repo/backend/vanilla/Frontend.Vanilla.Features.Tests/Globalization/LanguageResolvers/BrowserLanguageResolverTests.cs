using FluentAssertions;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Features.Globalization;
using Frontend.Vanilla.Features.Globalization.LanguageResolvers;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Moq;
using Microsoft.AspNetCore.Http;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Globalization.LanguageResolvers;

public sealed class BrowserLanguageResolverTests
{
    private readonly IBrowserLanguageResolver target;
    private readonly Mock<ILanguageByNameResolver> languageByNameResolver;
    private readonly Mock<IHttpContextAccessor> httpContextAccessor;

    private readonly LanguageInfo testLang;

    public BrowserLanguageResolverTests()
    {
        languageByNameResolver = new Mock<ILanguageByNameResolver>();
        httpContextAccessor = new Mock<IHttpContextAccessor>();

        target = new BrowserLanguageResolver(languageByNameResolver.Object, httpContextAccessor.Object);

        testLang = TestLanguageInfo.Get();

        httpContextAccessor.SetupGet(a => a.HttpContext.Request.Headers)
            .Returns(new HeaderDictionary { { HttpHeaders.AcceptLanguage, "fr-CH, fr;q=0.9, zh;q=0.8, de;q=0.7, *;q=0.5" } });
        languageByNameResolver.Setup(r => r.Resolve("de")).Returns(() => testLang);
    }

    private LanguageInfo Act() => target.Resolve();

    [Fact]
    public void ShouldParseFromHttpRequestLanguages()
    {
        var lang = Act();

        lang.Should().BeSameAs(testLang);
        languageByNameResolver.Verify(r => r.Resolve("fr-CH"));
        languageByNameResolver.Verify(r => r.Resolve("fr"));
        languageByNameResolver.Verify(r => r.Resolve("zh"));
        languageByNameResolver.VerifyWithAnyArgs(r => r.Resolve(null), Times.Exactly(4));
    }

    [Fact]
    public void ShouldReturnNull_IfNothing()
    {
        httpContextAccessor.SetupGet(a => a.HttpContext.Request.Headers).Returns(new HeaderDictionary());

        var lang = Act();

        lang.Should().BeNull();
    }
}
