using System;
using System.Collections;
using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.Testing.Moq;
using Frontend.Vanilla.Testing.Xunit;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Utils;

public class GuardTests
{
    public class NotNullTests
    {
        [Theory]
        [InlineData("foo")]
        public void ShouldReturnArgument_IfValidReferenceType(string arg)
            => Guard.NotNull(arg, nameof(arg)).Should().BeSameAs(arg);

        [Theory]
        [InlineData(123)]
        public void ShouldReturnArgument_IfValidValueType(int? arg)
            => Guard.NotNull(arg, nameof(arg)).Should().Be(arg);

        [Fact]
        public void ShouldThrow_IfNullReferenceType()
            => RunInvalidNotNullTest<string>(null);

        [Fact]
        public void ShouldThrow_IfNullValueType()
            => RunInvalidNotNullTest<int?>(null);

        private void RunInvalidNotNullTest<T>(T arg)
            => new Action(() => Guard.NotNull(arg, nameof(arg)))
                .Should().Throw<ArgumentNullException>().WithMessage("Value cannot be null. (Parameter 'arg')");

        [Theory]
        [InlineData(null)]
        public void ShouldSupportCustomMessage(object arg)
            => new Action(() => Guard.NotNull(arg, nameof(arg), "No nulls, bro!"))
                .Should().Throw<ArgumentNullException>().WithMessage("No nulls, bro! (Parameter 'arg')");
    }

    public class NotEmptyStringTests
    {
        [Theory]
        [InlineData("  ")]
        [InlineData("foo")]
        public void ShouldReturnArgument_IfValid(string str)
            => Guard.NotEmpty(str, nameof(str)).Should().BeSameAs(str);

        [Theory]
        [InlineData(null)]
        [InlineData("")]
        public void ShouldThrow_IfInvalid(string str)
            => new Action(() => Guard.NotEmpty(str, nameof(str)))
                .Should().Throw<ArgumentException>().WithMessage("String cannot be null nor empty. (Parameter 'str')");

        [Theory]
        [InlineData(null)]
        public void ShouldSupportCustomMessage(string str)
            => new Action(() => Guard.NotEmpty(str, nameof(str), "Custom message."))
                .Should().Throw<ArgumentException>().WithMessage("Custom message. (Parameter 'str')");
    }

    public class NotWhiteSpaceTests
    {
        [Theory]
        [InlineData("foo")]
        [InlineData("  foo  ")]
        public void ShouldReturnArgument_IfValid(string str)
            => Guard.NotWhiteSpace(str, nameof(str)).Should().BeSameAs(str);

        [Theory]
        [InlineData(null)]
        [InlineData("")]
        [InlineData("  ")]
        public void ShouldThrow_IfInvalid(string str)
            => new Action(() => Guard.NotWhiteSpace(str, nameof(str)))
                .Should().Throw<ArgumentException>().WithMessage("String cannot be null nor white-space. (Parameter 'str')");

        [Theory]
        [InlineData(null)]
        public void ShouldSupportCustomMessage(string str)
            => new Action(() => Guard.NotWhiteSpace(str, nameof(str), "Custom message."))
                .Should().Throw<ArgumentException>().WithMessage("Custom message. (Parameter 'str')");
    }

    public class TrimmedRequiredTests
    {
        [Theory]
        [InlineData("foo")]
        public void ShouldReturnArgument_IfValid(string str)
            => Guard.TrimmedRequired(str, nameof(str)).Should().Be(str);

        [Theory]
        [InlineData(null)]
        [InlineData("")]
        [InlineData("  ")]
        [InlineData("  foo")]
        [InlineData("foo  ")]
        public void ShouldThrow_IfInvalid(string str)
            => new Action(() => Guard.TrimmedRequired(str, nameof(str)))
                .Should().Throw<ArgumentException>().WithMessage($"Value must be a trimmed non-empty string. (Parameter 'str')");

        [Theory]
        [InlineData(null)]
        public void ShouldSupportCustomMessage(string str)
            => new Action(() => Guard.TrimmedRequired(str, nameof(str), "Custom message."))
                .Should().Throw<ArgumentException>().WithMessage("Custom message. (Parameter 'str')");
    }

    public class NotEmptyCollectionTests
    {
        [Theory]
        [InlineData(new[] { 1, 2, 3 })]
        public void ShouldReturnArgument_IfValid(int[] args)
            => Guard.NotEmpty(args, nameof(args)).Should().BeSameAs(args);

        [Theory]
        [InlineData(null)]
        [InlineData(new int[0])]
        public void ShouldThrow_IfNullOrEmpty(int[] args)
            => new Action(() => Guard.NotEmpty(args, nameof(args)))
                .Should().Throw<ArgumentException>().WithMessage("Collection cannot be null nor empty. (Parameter 'args')");

        [Theory]
        [InlineData(null)]
        public void ShouldSupportCustomMessage(int[] args)
            => new Action(() => Guard.NotEmpty(args, nameof(args), "Custom message."))
                .Should().Throw<ArgumentException>().WithMessage("Custom message. (Parameter 'args')");
    }

    public class NotNullItemsTests
    {
        public static readonly IEnumerable<object[]> PassedTestCases = new[]
        {
            new[] { "a", "b", "c", },
            new[] { "x" },
            new string[0],
        };

        [Theory, MemberValuesData(nameof(PassedTestCases))]
        public void ShouldReturnArgument_IfValid(string[] args)
            => Guard.NotNullItems(args, nameof(args)).Should().BeSameAs(args);

        public static readonly IEnumerable<object[]> FailedTestCases = new[]
        {
            new[] { "a", "b", null, "c", },
            null,
        };

        [Theory, MemberValuesData(nameof(FailedTestCases))]
        public void ShouldThrow_IfNullCollectionOrNullItems(string[] args)
            => new Action(() => Guard.NotNullItems(args, nameof(args)))
                .Should().Throw<ArgumentException>().WithMessage("Collection cannot be null nor contain null item(s). (Parameter 'args')");

        [Theory]
        [InlineData(null)]
        public void ShouldSupportCustomMessage(string[] args)
            => new Action(() => Guard.NotNullItems(args, nameof(args), "Custom message."))
                .Should().Throw<ArgumentException>().WithMessage("Custom message. (Parameter 'args')");
    }

    public class NotEmptyNorNullItemsTests
    {
        public static readonly IEnumerable<object[]> PassedTestCases = new[]
        {
            new[] { "a", "b", "c", },
            new[] { "x" },
        };

        [Theory]
        [MemberValuesData(nameof(PassedTestCases))]
        public void ShouldReturnArgument_IfValid(string[] args)
            => Guard.NotEmptyNorNullItems(args, nameof(args)).Should().BeSameAs(args);

        public static readonly IEnumerable<object[]> FailedTestCases = new[]
        {
            new object[] { new[] { "a", "b", null, "c", } },
            new object[] { new string[0] },
            new object[] { null },
        };

        [Theory]
        [MemberData(nameof(FailedTestCases))]
        public void ShouldThrow_IfNullCollectionOrNullItems(string[] args)
            => new Action(() => Guard.NotEmptyNorNullItems(args, nameof(args)))
                .Should().Throw<ArgumentException>().WithMessage("Collection cannot be null, empty nor contain null item(s). (Parameter 'args')");

        [Theory]
        [InlineData(null)]
        public void ShouldSupportCustomMessage(string[] args)
            => new Action(() => Guard.NotEmptyNorNullItems(args, nameof(args), "Custom message."))
                .Should().Throw<ArgumentException>().WithMessage("Custom message. (Parameter 'args')");
    }

    public class NotNullValuesTests
    {
        public static readonly IEnumerable<object[]> PassedTestCases = new[]
        {
            new object[] { new Dictionary<string, string> { { "a", "b" }, { "c", "d" } } },
            new object[] { new Dictionary<int, int> { { 1, 2 }, { 3, 4 } } },
            new object[] { new Dictionary<TimeSpan, TimeSpan>() },
        };

        [Theory]
        [MemberData(nameof(PassedTestCases))]
        public void ShouldReturnArgument_IfValid(IDictionary args)
            => Guard.NotNullValues(args, nameof(args)).Should().BeSameAs(args);

        public static readonly IEnumerable<object[]> FailedTestCases = new[]
        {
            new object[] { new Dictionary<string, string> { { "a", "b" }, { "c", null } } },
            new object[] { new Dictionary<int, int?> { { 1, 2 }, { 3, null } } },
            new object[] { null },
        };

        [Theory]
        [MemberData(nameof(FailedTestCases))]
        public void ShouldThrow_IfNullDictionaryOrNullValues(IDictionary args)
            => new Action(() => Guard.NotNullValues(args, nameof(args)))
                .Should().Throw<ArgumentException>().WithMessage("Dictionary cannot be null nor contain null in its Values. (Parameter 'args')");

        [Theory]
        [InlineData(null)]
        public void ShouldSupportCustomMessage(IDictionary args)
            => new Action(() => Guard.NotNullValues(args, nameof(args), "Custom message."))
                .Should().Throw<ArgumentException>().WithMessage("Custom message. (Parameter 'args')");
    }

    public class NotEmptyNorNullValuesTests
    {
        public static readonly IEnumerable<object[]> PassedTestCases = new[]
        {
            new object[] { new Dictionary<string, string> { { "a", "b" }, { "c", "d" } } },
            new object[] { new Dictionary<int, int> { { 1, 2 }, { 3, 4 } } },
        };

        [Theory]
        [MemberData(nameof(PassedTestCases))]
        public void ShouldReturnArgument_IfValid(IDictionary args)
            => Guard.NotEmptyNorNullValues(args, nameof(args)).Should().BeSameAs(args);

        public static readonly IEnumerable<object[]> FailedTestCases = new[]
        {
            new object[] { new Dictionary<string, string> { { "a", "b" }, { "c", null } } },
            new object[] { new Dictionary<int, int?> { { 1, 2 }, { 3, null } } },
            new object[] { new Dictionary<TimeSpan, TimeSpan>() },
            new object[] { null },
        };

        [Theory]
        [MemberData(nameof(FailedTestCases))]
        public void ShouldThrow_IfNullOrEmptyDictionaryOrNullValues(IDictionary args)
            => new Action(() => Guard.NotEmptyNorNullValues(args, nameof(args)))
                .Should().Throw<ArgumentException>().WithMessage("Dictionary cannot be null, empty nor contain null in its Values. (Parameter 'args')");

        [Theory]
        [InlineData(null)]
        public void ShouldSupportCustomMessage(IDictionary args)
            => new Action(() => Guard.NotEmptyNorNullValues(args, nameof(args), "Custom message."))
                .Should().Throw<ArgumentException>().WithMessage("Custom message. (Parameter 'args')");
    }

    public class GreaterTests
    {
        [Theory]
        [InlineData(123)]
        public void ShouldReturnArgument_IfValid(int? arg)
            => Guard.Greater(arg, 100, nameof(arg)).Should().Be(123);

        [Theory]
        [InlineData(null, "null")]
        [InlineData(66, "66")]
        [InlineData(100, "100")]
        public void ShouldThrow_IfInvalid(int? arg, string reportedValue)
            => new Action(() => Guard.Greater(arg, 100, nameof(arg)))
                .Should().Throw<ArgumentOutOfRangeException>().WithMessage($"Value must be greater than 100.\r\nActual value: {reportedValue} (Parameter 'arg')");

        [Theory]
        [InlineData(null)]
        public void ShouldSupportCustomMessage(int? arg)
            => new Action(() => Guard.Greater(arg, 100, nameof(arg), "Custom message."))
                .Should().Throw<ArgumentOutOfRangeException>().WithMessage("Custom message.\r\nActual value: null (Parameter 'arg')");
    }

    public class GreaterOrEqualTests
    {
        [Theory]
        [InlineData(100)]
        [InlineData(123)]
        public void ShouldReturnArgument_IfValid(int? arg)
            => Guard.GreaterOrEqual(arg, 100, nameof(arg)).Should().Be(arg);

        [Theory]
        [InlineData(null, "null")]
        [InlineData(66, "66")]
        public void ShouldThrow_IfInvalid(int? arg, string reportedValue)
            => new Action(() => Guard.GreaterOrEqual(arg, 100, nameof(arg)))
                .Should().Throw<ArgumentOutOfRangeException>()
                .WithMessage($"Value must be greater than or equal to 100.\r\nActual value: {reportedValue} (Parameter 'arg')");

        [Theory]
        [InlineData(null)]
        public void ShouldSupportCustomMessage(int? arg)
            => new Action(() => Guard.GreaterOrEqual(arg, 123, nameof(arg), "Custom message."))
                .Should().Throw<ArgumentOutOfRangeException>().WithMessage("Custom message.\r\nActual value: null (Parameter 'arg')");
    }

    public class LessTests
    {
        [Theory]
        [InlineData(123)]
        public void ShouldReturnArgument_IfValid(int? arg)
            => Guard.Less(arg, 200, nameof(arg)).Should().Be(arg);

        [Theory]
        [InlineData(null, "null")]
        [InlineData(66, "66")]
        [InlineData(100, "100")]
        public void ShouldThrow_IfInvalid(int? arg, string reportedValue)
            => new Action(() => Guard.Less(arg, 10, nameof(arg)))
                .Should().Throw<ArgumentOutOfRangeException>().WithMessage($"Value must be less than 10.\r\nActual value: {reportedValue} (Parameter 'arg')");

        [Theory]
        [InlineData(null)]
        public void ShouldSupportCustomMessage(int? arg)
            => new Action(() => Guard.Less(arg, 123, nameof(arg), "Custom message."))
                .Should().Throw<ArgumentOutOfRangeException>().WithMessage("Custom message.\r\nActual value: null (Parameter 'arg')");
    }

    public class LessOrEqualTests
    {
        [Theory]
        [InlineData(200)]
        [InlineData(123)]
        public void ShouldReturnArgument_IfValid(int? arg)
            => Guard.LessOrEqual(arg, 200, nameof(arg)).Should().Be(arg);

        [Theory]
        [InlineData(null, "null")]
        [InlineData(66, "66")]
        public void ShouldThrow_IfInvalid(int? arg, string reportedValue)
            => new Action(() => Guard.LessOrEqual(arg, 10, nameof(arg)))
                .Should().Throw<ArgumentOutOfRangeException>().WithMessage($"Value must be less than or equal to 10.\r\nActual value: {reportedValue} (Parameter 'arg')");

        [Theory]
        [InlineData(null)]
        public void ShouldSupportCustomMessage(int? arg)
            => new Action(() => Guard.LessOrEqual(arg, 123, nameof(arg), "Custom message."))
                .Should().Throw<ArgumentOutOfRangeException>().WithMessage("Custom message.\r\nActual value: null (Parameter 'arg')");
    }

    public class AbsoluteUriTests
    {
        [Fact]
        public void ShouldReturnArgument_IfValid()
        {
            var arg = new Uri("https://www.bwin.com/test");
            Guard.AbsoluteUri(arg, nameof(arg)).Should().BeSameAs(arg);
        }

        public static readonly IEnumerable<object[]> FailedTestCases = new[]
        {
            new object[] { null, "null" },
            new object[] { new Uri("relative", UriKind.Relative), "'relative'" },
            new object[] { new Uri("/rooted-relative", UriKind.Relative), "'/rooted-relative'" },
        };

        [Theory]
        [MemberData(nameof(FailedTestCases))]
        public void ShouldThrow_IfRelativeOrNull(Uri arg, string reportedValue)
            => new Action(() => Guard.AbsoluteUri(arg, nameof(arg)))
                .Should().Throw<ArgumentException>().WithMessage($"Value must be an absolute Uri.\r\nActual value: {reportedValue} (Parameter 'arg')");

        [Theory]
        [InlineData(null)]
        public void ShouldSupportCustomMessage(Uri arg)
            => new Action(() => Guard.AbsoluteUri(arg, nameof(arg), "Custom message."))
                .Should().Throw<ArgumentException>().WithMessage("Custom message.\r\nActual value: null (Parameter 'arg')");
    }

    public class DefinedEnumTests
    {
        public enum TestEnum
        {
#pragma warning disable SA1602 // Enumeration items should be documented
            Foo = 1,
#pragma warning restore SA1602 // Enumeration items should be documented
#pragma warning disable SA1602 // Enumeration items should be documented
            Bar = 2,
#pragma warning restore SA1602 // Enumeration items should be documented
        }

        [Theory]
        [InlineData(TestEnum.Foo)]
        [InlineData(TestEnum.Bar)]
        public void ShouldReturnArgument_IfValid(TestEnum arg)
            => Guard.DefinedEnum(arg, nameof(arg)).Should().Be(arg);

        [Theory]
        [InlineData((TestEnum)0, "0")]
        [InlineData((TestEnum)3, "3")]
        public void ShouldThrow_IfInvalid(TestEnum arg, string reportedValue)
            => new Action(() => Guard.DefinedEnum(arg, nameof(arg)))
                .Should().Throw<ArgumentOutOfRangeException>()
                .WithMessage(
                    $"Value must be one of defined values of enum {typeof(TestEnum)} which are: Foo (1), Bar (2).\r\nActual value: {reportedValue} (Parameter 'arg')");

        [Theory]
        [InlineData((TestEnum)3)]
        public void ShouldSupportCustomMessage(TestEnum arg)
            => new Action(() => Guard.DefinedEnum(arg, nameof(arg), "Custom message."))
                .Should().Throw<ArgumentOutOfRangeException>().WithMessage("Custom message.\r\nActual value: 3 (Parameter 'arg')");
    }

    public class CombinationOfDefinedFlagsTests
    {
        [Flags]
        public enum TestFlags
        {
#pragma warning disable SA1602 // Enumeration items should be documented
            Foo = 1,
#pragma warning restore SA1602 // Enumeration items should be documented
#pragma warning disable SA1602 // Enumeration items should be documented
            Bar = 2,
#pragma warning restore SA1602 // Enumeration items should be documented
        }

        [Theory]
        [InlineData(TestFlags.Foo)]
        [InlineData(TestFlags.Foo | TestFlags.Bar)]
        public void ShouldReturnArgument_IfValid(TestFlags arg)
            => Guard.CombinationOfDefinedFlags(arg, nameof(arg)).Should().Be(arg);

        [Theory]
        [InlineData((TestFlags)7)]
        public void IsCombinationOfDefinedFlags_ShouldThrow_IfInvalid(TestFlags arg)
            => new Action(() => Guard.CombinationOfDefinedFlags(arg, nameof(arg)))
                .Should().Throw<ArgumentOutOfRangeException>()
                .WithMessage(
                    $"Value must be a combination of defined values of [Flags] enum {typeof(TestFlags)} which are: Foo (1), Bar (2).\r\nActual value: 7 (Parameter 'arg')");

        [Theory]
        [InlineData((TestFlags)7)]
        public void ShouldSupportCustomMessage(TestFlags arg)
            => new Action(() => Guard.CombinationOfDefinedFlags(arg, nameof(arg), "Custom message."))
                .Should().Throw<ArgumentOutOfRangeException>().WithMessage("Custom message.\r\nActual value: 7 (Parameter 'arg')");
    }

    public class AssignableToTests
    {
        public interface IFoo { }

        public class Foo : IFoo { }

        public abstract class AbstractFoo { }

        [Theory]
        [InlineData(typeof(Foo))]
        [InlineData(typeof(IFoo))]
        public void ShouldReturnArgument_IfValid(Type arg)
            => Guard.AssignableTo<IFoo>(arg, nameof(arg)).Should().BeSameAs(arg);

        [Theory]
        [InlineData(null, "null")]
        [InlineData(typeof(string), "System.String")]
        [InlineData(typeof(IFoo), "Frontend.Vanilla.Core.Tests.Utils.GuardTests+AssignableToTests+IFoo")]
        public void ShouldThrow_IfInvalid(Type arg, string reportedValue)
            => new Action(() => Guard.AssignableTo<Foo>(arg, nameof(arg)))
                .Should().Throw<ArgumentException>().WithMessage($"Value must be a type assignable to {typeof(Foo)}.\r\nActual value: {reportedValue} (Parameter 'arg')");

        [Theory]
        [InlineData(null)]
        public void ShouldSupportCustomMessage(Type arg)
            => new Action(() => Guard.AssignableTo<string>(arg, nameof(arg), "Custom message."))
                .Should().Throw<ArgumentException>().WithMessage("Custom message.\r\nActual value: null (Parameter 'arg')");
    }

    public class InterfaceTests
    {
        public interface IFoo { }

        public class Foo : IFoo { }

        [Theory]
        [InlineData(typeof(IFoo))]
        public void ShouldReturnArgument_IfValid(Type arg)
            => Guard.Interface(arg, nameof(arg)).Should().BeSameAs(arg);

        [Theory]
        [InlineData(null, "null")]
        [InlineData(typeof(string), "System.String")]
        [InlineData(typeof(Foo), "Frontend.Vanilla.Core.Tests.Utils.GuardTests+InterfaceTests+Foo")]
        public void ShouldThrow_IfInvalid(Type arg, string reportedValue)
            => new Action(() => Guard.Interface(arg, nameof(arg)))
                .Should().Throw<ArgumentException>().WithMessage($"Value must be an interface type.\r\nActual value: {reportedValue} (Parameter 'arg')");

        [Theory]
        [InlineData(null)]
        public void ShouldSupportCustomMessage(Type arg)
            => new Action(() => Guard.Interface(arg, nameof(arg), "Custom message."))
                .Should().Throw<ArgumentException>().WithMessage("Custom message.\r\nActual value: null (Parameter 'arg')");
    }

    public class FinalClassTests
    {
        public interface IFoo { }

        public class Foo : IFoo { }

        public abstract class AbstractFoo { }

        [Theory]
        [InlineData(typeof(Foo))]
        public void ShouldReturnArgument_IfValid(Type arg)
            => Guard.FinalClass(arg, nameof(arg)).Should().BeSameAs(arg);

        [Theory]
        [InlineData(null, "null")]
        [InlineData(typeof(IFoo), "Frontend.Vanilla.Core.Tests.Utils.GuardTests+FinalClassTests+IFoo")]
        [InlineData(typeof(AbstractFoo), "Frontend.Vanilla.Core.Tests.Utils.GuardTests+FinalClassTests+AbstractFoo")]
        public void ShouldThrow_IfInvalid(Type arg, string reportedValue)
            => new Action(() => Guard.FinalClass(arg, nameof(arg)))
                .Should().Throw<ArgumentException>()
                .WithMessage($"Value must be a final non-abstract class which can be instantiated.\r\nActual value: {reportedValue} (Parameter 'arg')");

        [Theory]
        [InlineData(null)]
        public void ShouldSupportCustomMessage(Type arg)
            => new Action(() => Guard.FinalClass(arg, nameof(arg), "Custom message."))
                .Should().Throw<ArgumentException>().WithMessage("Custom message.\r\nActual value: null (Parameter 'arg')");
    }

    public class RequiresValueTests
    {
        [Theory]
        [InlineData("foo")]
        public void ShouldPass_IfConditionIsTrue(string arg)
        {
            var condition = new Mock<Predicate<string>>();
            condition.SetupWithAnyArgs(c => c(null)).Returns(true);

            Guard.Requires(arg, condition.Object, nameof(arg), "Message."); // Act

            condition.Verify(c => c(arg));
        }

        public static readonly IEnumerable<object[]> FailedTestCases = new[]
        {
            new object[] { "foo", "'foo'" },
            new object[] { null, "null" },
            new object[] { 123, "123" },
            new object[] { new Uri("http://bwin.com/"), "'http://bwin.com/'" },
            new object[] { new DateTime(2001, 2, 3, 14, 15, 16, DateTimeKind.Utc), "2001-02-03 14:15:16 Utc" },
        };

        [Theory]
        [MemberData(nameof(FailedTestCases))]
        public void ShouldThrow_IfConditionIsFalse(object arg, string reportedArg)
        {
            var condition = new Mock<Predicate<object>>();

            Action act = () => Guard.Requires(arg, condition.Object, nameof(arg), "Error message.");

            act.Should().Throw<ArgumentException>().WithMessage($"Error message.\r\nActual value: {reportedArg} (Parameter 'arg')");
            condition.Verify(c => c(arg));
        }
    }
}
