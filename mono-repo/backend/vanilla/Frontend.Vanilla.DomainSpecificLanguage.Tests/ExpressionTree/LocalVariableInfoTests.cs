using System;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.ExpressionTree;

public class LocalVariableInfoTests
{
    [Theory]
    [InlineData(true, true)]
    [InlineData(true, false)]
    [InlineData(false, true)]
    public void ShouldCreateCorrectly(bool isAssigned, bool isAccessed)
    {
        var type = DslTypeHelper.ResultTypes[RandomGenerator.GetInt32(DslTypeHelper.ResultTypes.Count)];

        // Act
        var target = new LocalVariableInfo(type, isAssigned, isAccessed);

        target.Type.Should().Be(type);
        target.IsAssigned.Should().Be(isAssigned);
        target.IsAccessed.Should().Be(isAccessed);
    }

    [Fact]
    public void ShouldThrow_IfNotAssignedNorAccessed()
        => ExpectThrows(() => new LocalVariableInfo(DslType.String, false, false), nameof(LocalVariableInfo.IsAssigned));

    [Fact]
    public void ShouldThrow_IfVoidType()
        => ExpectThrows(() => new LocalVariableInfo(DslType.Void, true, false), nameof(LocalVariableInfo.Type));

    private void ExpectThrows(Func<object> act, string expectedParam)
        => act.Should().Throw<ArgumentException>()
            .Which.ParamName.Should().Be(expectedParam.ToCamelCase());
}
