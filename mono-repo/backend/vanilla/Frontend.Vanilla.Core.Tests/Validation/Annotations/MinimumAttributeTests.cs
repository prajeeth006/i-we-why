using System;
using FluentAssertions;
using Frontend.Vanilla.Core.Validation.Annotations;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Validation.Annotations;

public sealed class MinimumAttributeTests
{
    [Theory]
    [InlineData(true, (short)10)]
    [InlineData(true, (int)10)]
    [InlineData(true, (long)10)]
    [InlineData(true, (float)10)]
    [InlineData(true, (double)10)]
    [InlineData(true, (short)52)]
    [InlineData(true, (int)52)]
    [InlineData(true, (long)52)]
    [InlineData(true, (float)52.34)]
    [InlineData(true, (double)52.34)]
    [InlineData(false, (short)9)]
    [InlineData(false, (int)9)]
    [InlineData(false, (long)9)]
    [InlineData(false, (float)9.54)]
    [InlineData(false, (double)9.54)]
    public void ShouldValidateNumber<T>(bool expectedIsValid, T value)
    {
        var target = new MinimumAttribute(10);

        var reason = target.GetInvalidReason(value); // Act

        reason.Should().Be(expectedIsValid ? null : "must be greater than or equal to 10");
    }

    [Theory]
    [InlineData(true, "00:10:00")]
    [InlineData(true, "02:15:00")]
    [InlineData(false, "00:09:59")]
    public void ShouldValidateTimeSpan(bool expectedIsValid, string value)
    {
        var target = new MinimumTimeSpanAttribute("00:10:00");

        var reason = target.GetInvalidReason(TimeSpan.Parse(value)); // Act

        reason.Should().Be(expectedIsValid ? null : "must be greater than or equal to 00:10:00");
    }
}
