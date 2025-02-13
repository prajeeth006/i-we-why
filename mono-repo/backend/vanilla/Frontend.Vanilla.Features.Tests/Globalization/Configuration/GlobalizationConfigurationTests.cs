using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.Features.Globalization;
using Frontend.Vanilla.Features.Globalization.Configuration;
using Frontend.Vanilla.Testing.Fakes;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Globalization.Configuration;

public class GlobalizationConfigurationTests
{
    [Fact]
    public void ShouldCreateCorrectly()
    {
        var def = TestLanguageInfo.Get();
        var search = TestLanguageInfo.Get();
        var allowed1 = TestLanguageInfo.Get();
        var allowed2 = TestLanguageInfo.Get();
        var offline = TestLanguageInfo.Get();
        var hidden = TestLanguageInfo.Get();
        var inter = TestLanguageInfo.Get();

        // Act
        var target = new GlobalizationConfiguration(def, search, true, new[] { allowed1, allowed2 }, new[] { offline }, new[] { hidden }, new[] { inter });

        target.DefaultLanguage.Should().BeSameAs(def);
        target.SearchEngineLanguage.Should().BeSameAs(search);
        target.AllowedLanguages.Should().BeEquivalentTo(new List<LanguageInfo> { allowed1, allowed2 });
        target.OfflineLanguages.Should().BeEquivalentTo(new List<LanguageInfo> { offline });
        target.HiddenLanguages.Should().BeEquivalentTo(new List<LanguageInfo> { hidden });
        target.InternalLanguages.Should().BeEquivalentTo(new List<LanguageInfo> { inter });
        target.UseBrowserLanguage.Should().BeTrue();
    }
}
