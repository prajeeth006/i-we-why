using FluentAssertions;
using Frontend.Vanilla.Content.FieldConversion.Converters;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Testing.FluentAssertions;
using Frontend.Vanilla.Testing.Xunit;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.FieldConversion.Converters;

public class DateTimeConverterTests : ConverterTestsBase<UtcDateTime>
{
    public DateTimeConverterTests()
        => Target = new DateTimeConverter();

    [Theory]
    [InlineData("20120211T010203")]
    [InlineData("  20120211T010203\t")]
    public void ShouldConvertDate(string inputValue)
    {
        Context.SetupGet(x => x.FieldValue).Returns(inputValue);
        ConvertAndExpect(new UtcDateTime(2012, 2, 11, 1, 2, 3)); // Act
    }

    [Theory, MemberValuesData(nameof(EmptyValues))]
    public void ShouldReturnDefault_IfEmptyInput(string inputValue)
    {
        Context.SetupGet(x => x.FieldValue).Returns(inputValue);
        ConvertAndExpect(default); // Act
    }

    [Fact]
    public void ShouldThrow_IfInvalidDate()
    {
        Context.SetupGet(x => x.FieldValue).Returns("shit");
        Target_Convert.Should().Throw() // Act
            .Which.Message.Should().Contain(DateTimeConverter.Format);
    }
}
