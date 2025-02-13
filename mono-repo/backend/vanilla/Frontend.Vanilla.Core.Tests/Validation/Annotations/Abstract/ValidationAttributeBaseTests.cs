using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using FluentAssertions;
using Frontend.Vanilla.Core.Validation.Annotations.Abstract;
using Frontend.Vanilla.Testing.FluentAssertions;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Validation.Annotations.Abstract;

public sealed class ValidationAttributeBaseTests
{
    internal class TestValidationAttribute : ValidationAttributeBase
    {
        public override string GetInvalidReason(object value)
        {
            switch ((string)value)
            {
                case "null-reason":
                    return null;
                case "empty-reason":
                    return "";
                case "white-space-reason":
                    return "  ";
                default:
                    return "must be valid";
            }
        }
    }

    public class TestData
    {
        [TestValidation]
        public string Text { get; set; }

        [TestValidation(
            ErrorMessage = "Member: " + ValidationAttributeBase.Placeholders.MemberName
                                      + " Reason: " + ValidationAttributeBase.Placeholders.InvalidReason
                                      + " ActualValue: " + ValidationAttributeBase.Placeholders.ActualValue)]
        public string CustomMessage { get; set; }
    }

    // Should skip validation b/c [Required] is supposed to validate it
    [Theory]
    [InlineData(true, null)]
    [InlineData(true, "")]
    [InlineData(true, "  ")]
    [InlineData(true, "null-reason")]
    [InlineData(true, "empty-reason")]
    [InlineData(true, "white-space-reason")]
    [InlineData(false, "lol")]
    public void ShouldValidate(bool expectedIsValid, string text)
    {
        var obj = new TestData { Text = text };
        obj.Should().BeValidIf(expectedIsValid, new ValidationResult($"Text must be valid. Actual value: '{text}'.", new[] { "Text" }));
    }

    [Fact]
    public void ShouldSupportCustomMessage()
    {
        var obj = new TestData { CustomMessage = "lol" };
        obj.Should().BeInvalid(new ValidationResult("Member: CustomMessage Reason: must be valid ActualValue: 'lol'", new[] { "CustomMessage" }));
    }

    public static readonly IEnumerable<object[]> FormatValueTestCases = new[]
    {
        new object[] { null, "null" },
        new object[] { "", "''" },
        new object[] { "  ", "'  '" },
        new object[] { new Uri("http://bwin.com/"), "'http://bwin.com/'" },
        new object[] { new object(), "System.Object" },
        new object[] { 123, "123" },
    };

    [Theory]
    [MemberData(nameof(FormatValueTestCases))]
    public void ShouldCorrectlyFormatActualValue(object value, string expected)
    {
        var result = new TestValidationAttribute().FormatActualValue(value);
        result.Should().Be(expected);
    }
}
