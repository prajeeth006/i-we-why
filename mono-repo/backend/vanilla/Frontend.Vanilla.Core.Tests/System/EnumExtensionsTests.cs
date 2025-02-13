using System;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Testing.FluentAssertions;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.System;

public sealed class EnumExtensionsTests
{
    [Theory]
    [InlineData(true, DayOfWeek.Sunday)]
    [InlineData(true, DayOfWeek.Monday)]
    [InlineData(false, (DayOfWeek)666)]
    [InlineData(true, ShortEnum.None)]
    [InlineData(false, (ShortEnum)1)]
    [InlineData(true, ShortEnum.Foo)]
    public void IsDefinedEnumTest<T>(bool expected, T value)
        where T : Enum
        => value.IsDefinedEnum().Should().Be(expected);

    [Flags]
    public enum TestFlags
    {
        /// <summary>
        /// None
        /// </summary>
        None = 0,

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
    }

    [Flags]
    public enum FlagsWithoutZero
    {
        // Missing 0

        /// <summary>
        /// First
        /// </summary>
        First = 1,

        /// <summary>
        /// Confusing
        /// </summary>
        Confusing = 3,
    }

    [Flags]
    public enum ShortEnum : short
    {
        /// <summary>
        /// None
        /// </summary>
        None = 0,

        /// <summary>
        /// Foo
        /// </summary>
        Foo = 2,
    }

    [Theory]
    [InlineData(true, TestFlags.None)]
    [InlineData(true, TestFlags.First)]
    [InlineData(true, TestFlags.Third)]
    [InlineData(true, TestFlags.First | TestFlags.Third)]
    [InlineData(true, TestFlags.First | TestFlags.Second | TestFlags.Third)]
    [InlineData(false, (TestFlags)10)]
    [InlineData(false, (TestFlags)666)]
    [InlineData(false, (FlagsWithoutZero)0)]
    [InlineData(true, FlagsWithoutZero.First)]
    [InlineData(false, (FlagsWithoutZero)2)]
    [InlineData(true, FlagsWithoutZero.Confusing)]
    [InlineData(true, ShortEnum.None)]
    [InlineData(false, (ShortEnum)1)]
    [InlineData(true, ShortEnum.Foo)]
    public void IsCombinationOfDefinedFlagsTest<T>(bool expected, T value)
        where T : Enum
        => value.IsCombinationOfDefinedFlags().Should().Be(expected);

    [Theory]
    [InlineData(TestFlags.None, TestFlags.First, TestFlags.None)]
    [InlineData(TestFlags.First, TestFlags.First, TestFlags.None)]
    [InlineData(TestFlags.Second, TestFlags.First, TestFlags.Second)]
    [InlineData(TestFlags.Second | TestFlags.Third, TestFlags.First, TestFlags.Second | TestFlags.Third)]
    [InlineData(TestFlags.First | TestFlags.Second | TestFlags.Third, TestFlags.First, TestFlags.Second | TestFlags.Third)]
    public void RemoveFlagTest(TestFlags input, TestFlags flagToRemove, TestFlags expected)
        => input.RemoveFlag(flagToRemove).Should().Be(expected);

    [Theory]
    [InlineData((TestFlags)66, typeof(TestFlags))]
    [InlineData((ShortEnum)66, typeof(ShortEnum))]
    public void GetInvalidException_Test<T>(T value, Type expectedType)
        where T : Enum
    {
        var ex = value.GetInvalidException(); // Act
        ex.Message.Should().ContainAll("66", expectedType);
    }
}
