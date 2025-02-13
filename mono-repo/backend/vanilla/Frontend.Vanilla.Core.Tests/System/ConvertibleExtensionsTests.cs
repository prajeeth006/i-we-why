using System;
using System.Globalization;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.Globalization.LanguageResolvers;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.System;

public class ConvertibleExtensionsTests
{
    [Fact]
    public void ToInvariantString_Test()
    {
        CultureInfoHelper.SetCurrent(CultureInfo.GetCultureInfo("sk-SK"));
        var money = 1.23m;
        money.ToString().Should().Be("1,23");
        money.ToInvariantString().Should().Be("1.23");
    }

    [Theory]
    [InlineData(DayOfWeek.Wednesday, 3)]
    [InlineData(66L, 66)]
    [InlineData(66, 66)]
    public void ToInt32_Test<T>(T value, int expected)
        where T : IConvertible
        => value.ToInt32().Should().Be(expected);
}
