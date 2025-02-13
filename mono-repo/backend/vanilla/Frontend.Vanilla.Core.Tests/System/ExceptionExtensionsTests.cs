using System;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.System;

public sealed class ExceptionExtensionsTests
{
    [Fact]
    public void GetMesssageIncludingInner_ShouldGetMessageDirectlyIfNoInnerException()
        => new Exception("Oups").GetMessageIncludingInner().Should().Be("Oups");

    [Fact]
    public void GetMesssageIncludingInner_ShouldCollectMessageFromAllInnerExceptions()
    {
        var ex = new Exception("Outer", new Exception("Middle", new Exception("Inner")));
        ex.GetMessageIncludingInner().Should().Be($"Outer{Environment.NewLine}--> Middle{Environment.NewLine}--> Inner");
    }

    [Fact]
    public void ExtractInner_ShouldGetExceptionDirectly_IfExactType()
    {
        Exception ex = new ArgumentException();
        ex.ExtractInner<ArgumentException>().Should().BeSameAs(ex);
    }

    [Fact]
    public void ExtractInner_ShouldGetInnerExceptionDirectly_IfTypeMatches()
    {
        var ex = new Exception("Oups 1", new Exception("Oups 2", new ArgumentException()));
        ex.ExtractInner<ArgumentException>().Should().BeSameAs(ex.InnerException.InnerException);
    }

    [Fact]
    public void ExtractInner_ShouldReturnNull_IfNoTypeMatches()
    {
        var ex = new Exception("Oups 1", new Exception("Oups 2"));
        ex.ExtractInner<ArgumentException>().Should().BeNull();
    }

    [Fact]
    public void ExtractAllInner_ShouldReturnAll_IfAggregateException()
    {
        var ex1 = new InvalidOperationException("Oups 1", new InvalidOperationException("Excluded b/c nested"));
        var ex2 = new InvalidOperationException("Oups 2");
        var ex = new Exception(
            "Other 1",
            new AggregateException(
                ex1,
                new Exception("Other 2"),
                new AggregateException(
                    new Exception("Other 3", ex2),
                    new Exception("Other 4"))));

        ex.ExtractAllInner<InvalidOperationException>().Should().Equal(ex1, ex2);
    }
}
