using System;
using FluentAssertions;
using Frontend.Vanilla.Content.FieldConversion.Converters;
using Frontend.Vanilla.Testing.Xunit;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.FieldConversion.Converters;

public class BoolConverterTests : ConverterTestsBase<bool>
{
    public BoolConverterTests() => Target = new BoolConverter();

    [Theory]
    [InlineData("1", true)]
    [InlineData("0", false)]
    public void ShouldConvertValueToBoolean(string inputValue, bool expectedValue)
    {
        Context.SetupGet(c => c.FieldValue).Returns(inputValue);
        ConvertAndExpect(expectedValue); // Act
    }

    [Theory, MemberValuesData(nameof(EmptyValues))]
    public void ShouldConvertToFalse_IfEmptyInput(string inputValue)
        => ShouldConvertValueToBoolean(inputValue, false);

    [Theory, ValuesData("true", "false", "bullshit")]
    public void ShouldThrow_IfUnsupportedValue(string inputValue)
    {
        Context.SetupGet(c => c.FieldValue).Returns(inputValue);
        Target_Convert.Should().Throw<FormatException>(); // Act
    }
}
