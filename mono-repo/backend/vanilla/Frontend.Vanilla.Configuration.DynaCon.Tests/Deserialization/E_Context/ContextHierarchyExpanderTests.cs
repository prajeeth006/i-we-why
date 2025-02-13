using System.Collections.Generic;
using System.Linq;
using Bwin.DynaCon.Api.Contracts.V1;
using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon.Deserialization.E_Context;
using Frontend.Vanilla.Core.System.Text;
using Xunit;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.Deserialization.E_Context;

public sealed class ContextHierarchyExpanderTests
{
    private IContextHierarchyExpander target;
    private VariationHierarchyResponse hierarchy;

    public ContextHierarchyExpanderTests()
    {
        target = new ContextHierarchyExpander();
        hierarchy = new VariationHierarchyResponse(
            new Dictionary<string, IReadOnlyDictionary<string, string>>
            {
                ["environment"] = new Dictionary<string, string>
                {
                    { "prod", null },
                    { "beta", "prod" },
                    { "test", null },
                    { "qa", "test" },
                    { "qa1", "qa" },
                    { "qa2", "qa" },
                    { "dev", "qa2" },
                },
            });
    }

    [Theory]
    [InlineData("test", new[] { "qa", "qa1", "qa2", "dev" })]
    [InlineData("qa", new[] { "qa1", "qa2", "dev" })]
    [InlineData("qa2", new[] { "dev" })]
    [InlineData("dev", new string[0])]
    [InlineData("prod", new[] { "beta" })]
    [InlineData("beta", new string[0])]
    [InlineData("fvt", new string[0])]
    public void GetChildren_Test(string input, string[] expected)
    {
        var actual = target.GetChildren(hierarchy, "environment", input);
        actual.Should().BeEquivalentTo(expected.Select(s => (RequiredString)s));
    }

    [Theory]
    [InlineData("prod", new string[0])]
    [InlineData("beta", new[] { "prod" })]
    [InlineData("test", new string[0])]
    [InlineData("qa", new[] { "test" })]
    [InlineData("qa1", new[] { "test", "qa" })]
    [InlineData("qa2", new[] { "test", "qa" })]
    [InlineData("dev", new[] { "test", "qa", "qa2" })]
    [InlineData("fvt", new string[0])]
    // Not in hierarchy
    public void GetParents_Test(string input, string[] expected)
    {
        var actual = target.GetParents(hierarchy, "environment", input);
        actual.Should().BeEquivalentTo(expected.Select(s => (RequiredString)s));
    }
}
