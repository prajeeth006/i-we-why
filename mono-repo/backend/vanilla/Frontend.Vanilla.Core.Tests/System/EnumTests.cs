using System;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Testing.FluentAssertions;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.System;

public sealed class EnumTests
{
    public enum TestEnum
    {
        /// <summary>
        /// Foo
        /// </summary>
        Foo,

        /// <summary>
        /// Bar
        /// </summary>
        Bar,
    }

    [Fact]
    public void Values_ShouldListAllDefinedValues()
        => Enum<TestEnum>.Values.Should().BeEquivalentTo(TestEnum.Foo, TestEnum.Bar);

    [Flags]
    public enum TestCombination
    {
        /// <summary>
        /// Zero
        /// </summary>
        Zero = 0,

        /// <summary>
        /// First
        /// </summary>
        First = 1,

        /// <summary>
        /// Second
        /// </summary>
        Second = 2,

        /// <summary>
        /// Third
        /// </summary>
        Third = 4,

        /// <summary>
        /// Combined
        /// </summary>
        Combined = First | Third,
    }

    [Fact]
    public void FlagCombinations_ShouldListAllCombinationsOfDefinedFlags()
        => Enum<TestCombination>.FlagCombinations.Should().BeEquivalentTo(
            TestCombination.Zero,
            TestCombination.First,
            TestCombination.Second,
            TestCombination.Third,
            TestCombination.First | TestCombination.Second,
            TestCombination.First | TestCombination.Third,
            TestCombination.Second | TestCombination.Third,
            TestCombination.First | TestCombination.Second | TestCombination.Third);

    [Fact]
    public void FlagCombinations_ShouldThrow_IfFlagsEnum()
        => new Func<object>(() => Enum<DayOfWeek>.FlagCombinations)
            .Should().Throw().WithMessage("System.DayOfWeek is not [Flags] enum type.");

    [Fact]
    public void Parse_ShouldParseFromString()
        => Enum<DayOfWeek>.Parse("Monday").Should().Be(DayOfWeek.Monday);
}
