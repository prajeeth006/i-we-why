using System;
using FluentAssertions;
using Frontend.Vanilla.Content.FieldConversion.Converters;
using Frontend.Vanilla.Testing.FluentAssertions;
using Frontend.Vanilla.Testing.Xunit;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.FieldConversion.Converters;

public class IntConverterTests : ConverterTestsBase<int>
{
    public IntConverterTests()
        => Target = new IntConverter();

    [Theory]
    [InlineData("0", 0)]
    [InlineData("123", 123)]
    [InlineData("-7", -7)]
    public void ShouldConvertCorrectly(string inputValue, int expected)
    {
        Context.SetupGet(c => c.FieldValue).Returns(inputValue);
        ConvertAndExpect(expected); // Act
    }

    [Theory, MemberValuesData(nameof(EmptyValues))]
    public void ShouldConvertToZero_IfEmptyInput(string inputValue)
        => ShouldConvertCorrectly(inputValue, 0);

    [Theory, ValuesData("ab", "12.34")]
    public void ShouldThrow_IfInvalidNumber(string inputValue)
    {
        Context.SetupGet(c => c.FieldValue).Returns(inputValue);
        Target_Convert.Should().Throw() // Act
            .Which.Should().BeOfType(inputValue != null ? typeof(FormatException) : typeof(ArgumentNullException));
    }
}
