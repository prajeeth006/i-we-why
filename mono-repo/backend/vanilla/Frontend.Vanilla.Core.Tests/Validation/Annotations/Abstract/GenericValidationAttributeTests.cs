using System;
using FluentAssertions;
using Frontend.Vanilla.Core.Validation.Annotations.Abstract;
using Frontend.Vanilla.Testing.FluentAssertions;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Validation.Annotations.Abstract;

public class GenericValidationAttributeTests
{
    internal class TestValidationAttribute : GenericValidationAttribute
    {
        protected override Type GenericType => typeof(IFoo<,>);

        public string GetInvalidReason<T1, T2>(IFoo<T1, T2> foo)
            => $"Reason {foo.Id} {typeof(T1)} {typeof(T2)}";

        public string FormatActualValue<T1, T2>(IFoo<T1, T2> foo)
            => $"Formatted {foo.Id} {typeof(T1)} {typeof(T2)}";
    }

    public interface IFoo<T1, T2>
    {
        int Id { get; }
    }

    private ValidationAttributeBase target;
    private object testObj;

    public GenericValidationAttributeTests()
    {
        target = new TestValidationAttribute();
        testObj = Mock.Of<IFoo<string, int>>(f => f.Id == 123);
    }

    [Fact]
    public void ErrorMessage_ShouldPutNewLineBeforeActualValue()
        => target.ErrorMessage.Should().Be("{MemberName} {InvalidReason}" + Environment.NewLine + "Actual value: {ActualValue}");

    [Fact]
    public void GetInvalidReason_ShouldCallGenericMethod()
        => target.GetInvalidReason(testObj).Should().Be("Reason 123 System.String System.Int32");

    [Fact]
    public void GetInvalidReason_ShouldThrow_IfIncompatibleValue()
        => RunIncompatibleValueTest(() => target.GetInvalidReason(new object()));

    [Fact]
    public void FormatActualValue_ShouldCallGenericMethod()
        => target.FormatActualValue(testObj).Should().Be("Formatted 123 System.String System.Int32");

    [Fact]
    public void FormatActualValue_ShouldThrow_IfIncompatibleValue()
        => RunIncompatibleValueTest(() => target.FormatActualValue(new object()));

    private static void RunIncompatibleValueTest(Action act)
        => act.Should().Throw().WithMessage(
            $"Object must implement {typeof(IFoo<,>)} once"
            + $" to be validatable by {typeof(TestValidationAttribute)} but current value is System.Object which implements it 0 times.");
}
