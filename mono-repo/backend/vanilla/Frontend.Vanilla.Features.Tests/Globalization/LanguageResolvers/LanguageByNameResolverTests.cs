using FluentAssertions;
using Frontend.Vanilla.Features.Globalization.LanguageResolvers;
using Frontend.Vanilla.Testing.Fakes;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Globalization.LanguageResolvers;

public sealed class LanguageByNameResolverTests
{
    [Theory]
    [InlineData(null, null)]
    [InlineData("  ", null)]
    [InlineData("de-AT", 1)]
    [InlineData("DE-at", 1)]
    [InlineData("de-DE", 1)] // Should match just by language code
    [InlineData("fr-FR", null)]
    [InlineData("gibberish", null)]
    public void ShouldGetLanguageByName(string name, int? expectedIndex)
    {
        var langs = new[]
        {
            TestLanguageInfo.Get("en-US"),
            TestLanguageInfo.Get("de-AT"),
        };
        var allowedLanguagesResolver = Mock.Of<IAllowedLanguagesResolver>(r => r.Languages == langs);
        ILanguageByNameResolver target = new LanguageByNameResolver(allowedLanguagesResolver);

        // Act
        var result = target.Resolve(name);

        result.Should().BeSameAs(expectedIndex != null ? langs[expectedIndex.Value] : null);
    }
}
