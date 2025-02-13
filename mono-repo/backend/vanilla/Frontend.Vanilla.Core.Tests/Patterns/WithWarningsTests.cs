using System.Collections.Generic;
using System.Linq;
using FluentAssertions;
using Frontend.Vanilla.Core.Patterns;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Testing;
using Frontend.Vanilla.Testing.Fakes;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Patterns;

public class WithWarningsTests
{
    public static IEnumerable<object[]> TestCases => new[]
    {
        new object[] { null },
        new object[] { "abc" },
        new object[] { 123 },
    };

    public static IEnumerable<object[]> BooleanWithTestCases => TestValues.Booleans.ToTestCases().CombineWith(null, "abc", 123);

    [Theory, MemberData(nameof(TestCases))]
    public void Constructor_ShouldCreateCorrectly<T>(T value)
    {
        var warnings = new[] { "ab", "xy" }.AsTrimmed();

        // Act
        var target = new WithWarnings<T>(value, warnings);

        target.Value.Should().Be(value);
        target.Warnings.Should().Equal(warnings).And.NotBeSameAs(warnings);
    }

    [Theory, MemberData(nameof(TestCases))]
    public void Deconstruct_ShouldReturnCorrectValues<T>(T value)
    {
        var target = new WithWarnings<T>(value, new[] { "ab", "xy" }.AsTrimmed());

        // Act
        var (deconstructedValue, deconstructedWarnings) = target;

        deconstructedValue.Should().Be(value);
        deconstructedWarnings.Should().BeSameAs(target.Warnings);
    }

    [Theory, MemberData(nameof(BooleanWithTestCases))]
    public void Constructor_ShouldCreateCorrectlyWithNoWarnings<T>(bool useImplicitOperator, T value)
    {
        // Act
        var target = useImplicitOperator
            ? value
            : new WithWarnings<T>(value);

        target.Value.Should().Be(value);
        target.Warnings.Should().BeEmpty();
    }

    [Theory, MemberData(nameof(BooleanWithTestCases))]
    public void WithWarnings_ShouldCreateCorrectly(bool userParamsOverload, object value)
    {
        IEnumerable<TrimmedRequiredString> warnings = new[] { "ab", "xy" }.AsTrimmed();

        // Act
        var target = userParamsOverload
            ? value.WithWarnings(warnings.ToArray())
            : value.WithWarnings(warnings);

        target.Value.Should().Be(value);
        target.Warnings.Should().Equal(warnings);
    }
}
