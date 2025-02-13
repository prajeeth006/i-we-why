using System;
using System.IO;
using FluentAssertions;
using Frontend.Vanilla.Core.Patterns;
using Frontend.Vanilla.DomainSpecificLanguage.Json;
using Frontend.Vanilla.Testing.FluentAssertions;
using Frontend.Vanilla.Testing.Moq;
using Moq;
using Newtonsoft.Json;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.Json;

public sealed class DslExpressionJsonConverterTests
{
    private DslExpressionJsonConverterBase target;
    private Mock<IDslCompiler> dslCompiler;

    public DslExpressionJsonConverterTests()
    {
        dslCompiler = new Mock<IDslCompiler>();
        target = new DslExpressionJsonConverter(() => dslCompiler.Object);
    }

    [Fact]
    public void Read_ShouldCompileExpression()
    {
        var expr = Mock.Of<IDslExpression<int>>();
        dslCompiler.Setup(c => c.Compile<int>("omg")).Returns(expr.WithWarnings());

        // Act
        var result = target.Read<int>("omg");

        result.Should().Be(expr);
    }

    [Fact]
    public void Read_ShouldThrow_IfNotString()
    {
        // Act
        Action act = () => target.Read<int>(123);

        act.Should().Throw().Which.Message.Should().ContainAll("non-white-space string", "123", typeof(int));
        dslCompiler.VerifyWithAnyArgs(c => c.Compile<int>(null), Times.Never);
    }

    [Fact]
    public void Write_ShouldWriteOriginalString()
    {
        var expr = Mock.Of<IDslExpression<int>>(e => e.OriginalString == "omg");
        var str = new StringWriter();

        // Act
        target.Write(new JsonTextWriter(str), expr);

        str.ToString().Should().Be(@"""omg""");
    }
}
