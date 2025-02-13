using System;
using System.Collections.Generic;
using System.Linq;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.DomainSpecificLanguage.Compilation;
using Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.ExpressionTree;

public sealed class DslResultTypeTests
{
    public static IEnumerable<object[]> GetTestCases() => new[]
    {
        new object[] { DslType.String, typeof(string) },
        new object[] { DslType.Boolean, typeof(bool) },
        new object[] { DslType.Number, typeof(decimal) },
        new object[] { DslType.Void, typeof(VoidDslResult) },
    };

    [Theory, MemberData(nameof(GetTestCases))]
    internal void ToClrType_Test(DslType dslType, Type expected)
        => dslType.ToClrType().Should().Be(expected);

    [Fact]
    public void GetTestCases_ShouldCoverAllTypes()
        => GetTestCases().Select(tc => tc[0]).Should().BeEquivalentTo(Enum<DslType>.Values);
}
