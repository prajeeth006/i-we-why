#nullable enable

using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Testing;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.Model;

public sealed class ProxyRuleTests
{
    public static IEnumerable<object[]?> TestCases => new object?[] { null, "", "  ", "IsOk" }.ToTestCases().CombineWith(null, "path")!; // TODO remove !

    [Theory, MemberData(nameof(TestCases))]
    public void ConstructorTest(string? condition, string? docIdStr)
    {
        var docId = docIdStr != null ? new DocumentId(docIdStr) : null;

        // Act
        var target = new ProxyRule(condition, docId);

        target.Condition.Should().Be(condition);
        target.TargetId.Should().Be(docId!);
    }
}
