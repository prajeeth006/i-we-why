using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using FluentAssertions;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Testing.Xunit;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Configuration;

public sealed class InvalidConfigurationExceptionTests
{
    [Theory]
    [InlineData(false)]
    [InlineData(true)]
    public void ShouldCreateException(bool userArrayCtor)
    {
        var error1 = new ValidationResult("Error A");
        var error2 = new ValidationResult("Error B", new[] { "Property" });

        var target = userArrayCtor // Act
            ? new InvalidConfigurationException(error1, error2)
            : new InvalidConfigurationException((IEnumerable<ValidationResult>)new[] { error1, error2 });

        target.Message.Should().Be($"Configuration instance is invalid: 1) Error A{Environment.NewLine}2) Error B");
        target.Errors.Should().Equal(error1, error2);
    }

    public static readonly IEnumerable InvalidArgTestCases = new[] { null, new ValidationResult[0], new ValidationResult[] { null } };

    [Theory]
    [MemberValuesData(nameof(InvalidArgTestCases))]
    public void ShouldThrow_IfInvalidArgs(IEnumerable<ValidationResult> errors)
        => new Action(() => new InvalidConfigurationException(errors)).Should().Throw<ArgumentException>();

    [Fact]
    public void ShouldCopyErrors()
    {
        var error = new ValidationResult("Error");
        var list = new List<ValidationResult> { error };
        var target = new InvalidConfigurationException(list);

        list.Clear(); // Act

        target.Errors.Should().Equal(error); // Should still contain same errors
    }
}
