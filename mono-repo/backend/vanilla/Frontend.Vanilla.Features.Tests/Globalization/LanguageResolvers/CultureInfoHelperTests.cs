#nullable enable

using System.Globalization;
using FluentAssertions;
using Frontend.Vanilla.Features.Globalization.LanguageResolvers;
using Frontend.Vanilla.Testing.Xunit;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Globalization.LanguageResolvers;

public class CultureInfoHelperTests
{
    [Fact]
    public void Find_ShouldFindCulture()
    {
        // Act
        var culture = CultureInfoHelper.Find("sw-KE");

        culture!.Name.Should().Be("sw-KE");
        culture.UseUserOverride.Should().BeFalse();
        culture.IsReadOnly.Should().BeFalse();
    }

    [Theory, ValuesData(null, "", "  ", "shit", "xx-YY")]
    public void Find_ShouldReturnNull_IfInvalidOrNotFound(string? value)
        => CultureInfoHelper.Find(value).Should().BeNull();

    [Fact]
    public void SetCurrent_ShouldSetBothCultures()
    {
        CultureInfo.CurrentCulture = CultureInfo.CurrentUICulture = new CultureInfo("en-US");
        // Act
        CultureInfoHelper.SetCurrent(new CultureInfo("sw-KE"));

        CultureInfo.CurrentCulture.Name.Should().Be("sw-KE");
        CultureInfo.CurrentUICulture.Name.Should().Be("sw-KE");
    }
}
