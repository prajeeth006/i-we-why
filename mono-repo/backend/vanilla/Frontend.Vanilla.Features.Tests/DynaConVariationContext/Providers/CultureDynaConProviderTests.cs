using System.Globalization;
using FluentAssertions;
using Frontend.Vanilla.Features.DynaConVariationContext.Providers;
using Frontend.Vanilla.Features.Globalization.LanguageResolvers;
using Frontend.Vanilla.Testing;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.DynaConVariationContext.Providers;

public class CultureDynaConProviderTests : DynaConProviderTestsBase
{
    public CultureDynaConProviderTests()
        => Target = new CultureDynaConProvider();

    [Fact]
    public void GetCurrentRawValue_ShouldGetCurrentCulture()
    {
        CultureInfoHelper.SetCurrent(CultureInfo.GetCultureInfo("zh-CN"));
        Target.GetCurrentRawValue().Should().Be("zh-CN");
    }
}
