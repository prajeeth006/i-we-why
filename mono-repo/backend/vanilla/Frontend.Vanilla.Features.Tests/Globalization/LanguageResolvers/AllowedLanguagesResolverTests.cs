using System;
using FluentAssertions;
using Frontend.Vanilla.Core.Caching;
using Frontend.Vanilla.Features.Globalization.Configuration;
using Frontend.Vanilla.Features.Globalization.LanguageResolvers;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Xunit;
using Microsoft.AspNetCore.Http;
using Moq;

namespace Frontend.Vanilla.Features.Tests.Globalization.LanguageResolvers;

public sealed class AllowedLanguagesResolverTests
{
    [RetryFact]
    public void ShouldExcludeHiddenLanguages()
    {
        var config = new Mock<IGlobalizationConfiguration>();
        var hiddenLanguagesResolver = new Mock<IHiddenLanguagesResolver>();
        var internalLanguagesResolver = new Mock<IInternalLanguagesResolver>();

        var serviceProviderMock = new Mock<IServiceProvider>();
        serviceProviderMock.Setup(_ => _.GetService(typeof(IRequestScopedValuesProvider))).Returns(new RequestScopedValuesProvider());

        var httpContextAccessor =
            Mock.Of<IHttpContextAccessor>(a => a.HttpContext == new DefaultHttpContext() && a.HttpContext.RequestServices == serviceProviderMock.Object);
        var target = new AllowedLanguagesResolver(config.Object, hiddenLanguagesResolver.Object, internalLanguagesResolver.Object, httpContextAccessor);

        var allowedLang1 = TestLanguageInfo.Get();
        var allowedLang2 = TestLanguageInfo.Get();
        var hiddenLang1 = TestLanguageInfo.Get();
        var hiddenLang2 = TestLanguageInfo.Get();
        var internalLang = TestLanguageInfo.Get();

        config.SetupGet(c => c.AllowedLanguages).Returns(new[] { allowedLang1, hiddenLang1, allowedLang2, hiddenLang2 });
        internalLanguagesResolver.Setup(r => r.Resolve()).Returns(new[] { internalLang });
        hiddenLanguagesResolver.Setup(r => r.Resolve()).Returns(new[] { hiddenLang1 });

        // Act
        var langs = target.Languages;

        langs.Should().BeEquivalentTo(new object[] { allowedLang1, allowedLang2, internalLang, hiddenLang2 });
        langs.Should().BeSameAs(target.Languages, "should be cached");
    }
}
