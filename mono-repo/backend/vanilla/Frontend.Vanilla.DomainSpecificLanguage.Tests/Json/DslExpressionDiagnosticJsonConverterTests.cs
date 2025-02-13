using System;
using System.IO;
using FluentAssertions;
using Frontend.Vanilla.DomainSpecificLanguage.Json;
using Frontend.Vanilla.Testing.FluentAssertions;
using Moq;
using Newtonsoft.Json;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.Json;

public class DslExpressionDiagnosticJsonConverterTests
{
    private DslExpressionJsonConverterBase target;

    public DslExpressionDiagnosticJsonConverterTests()
        => target = new DslExpressionDiagnosticJsonConverter();

    [Fact]
    public void Write_ShouldOutputDiagnosticInfo()
    {
        var str = new StringWriter();
        var expr = Mock.Of<IDslExpression<int>>(e => e.OriginalString == "original" && e.ToString() == "optimus");

        // Act
        target.Write(new JsonTextWriter(str), expr);

        str.ToString().Should().BeJson(@"{
                OriginalExpression: 'original',
                ActualOptimizedExpression: 'optimus',
                ResultType: 'System.Int32'
            }");
    }

    [Fact]
    public void Read_ShouldBeUnsupported()
    {
        target.CanRead.Should().BeFalse();
        target.Invoking(t => t.Read<int>(null)).Should().Throw<NotSupportedException>();
    }
}
