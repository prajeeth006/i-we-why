using System;
using FluentAssertions;
using Frontend.Vanilla.Core.Validation.Annotations;
using Frontend.Vanilla.Core.Validation.Annotations.Abstract;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Validation.Annotations;

public class DefinedEnumValueAttributeTests
{
    [Theory]
    [InlineData(DayOfWeek.Sunday, null)]
    [InlineData(DayOfWeek.Friday, null)]
    [InlineData((DayOfWeek)666, "is not one of allowed values: Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday for enum type System.DayOfWeek")]
    public void ShouldValidate(DayOfWeek input, string expectedReason)
    {
        ValidationAttributeBase target = new DefinedEnumValueAttribute();

        var result = target.GetInvalidReason(input); // Act

        result.Should().Be(expectedReason);
    }
}
