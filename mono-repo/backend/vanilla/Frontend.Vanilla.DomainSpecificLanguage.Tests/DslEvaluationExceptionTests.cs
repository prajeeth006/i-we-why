using System;
using FluentAssertions;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests;

public class DslEvaluationExceptionTests
{
    [Fact]
    public void ShoulCreateCorrectly()
    {
        var ex = new Exception();

        // Act
        var target = new DslEvaluationException("msg", ex);

        target.Message.Should().Be("msg");
        target.InnerException.Should().BeSameAs(ex);
    }
}
