using System;
using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Features.DomainSpecificActions.Configuration;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.FluentAssertions;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.DomainSpecificActions.Configuration;

public class DsaRegionSelectorTests
{
    private static readonly IDsaRegionSelector Target = new DsaRegionSelector();

    private static readonly IReadOnlyList<TrimmedRequiredString> SupportedRegions = new[] { "Foo", "Bar", "Foo-Bar" }.AsTrimmed();

    public static IEnumerable<object[]> JsonTestCases()
    {
        yield return new object[]
        {
            "Foo",
            $"Op1() Op2(){Environment.NewLine}Op3(){Environment.NewLine}Op5()",
        };
        yield return new object[]
        {
            "Bar",
            $"Op3(){Environment.NewLine}Op4(){Environment.NewLine}Op5()",
        };
        yield return new object[]
        {
            "Foo-Bar",
            $"Op3(){Environment.NewLine}Op5(){Environment.NewLine}Op6()",
        };
        // Add more test cases here
    }

    [Theory]
    [MemberData(nameof(JsonTestCases))]
    public void ShouldKeepOnlySelectedRegion(string region, string expected)
    {
        var action = @"#EXECUTE Foo
                Op1() Op2()
                #END-EXECUTE
                Op3()
                #EXECUTE    Bar   Op4() #END-EXECUTE
                Op5()
                #EXECUTE Foo-Bar
                Op6()
                #END-EXECUTE";

        // Act
        var result = Target.SelectRegion(action, region, SupportedRegions);

        result.Should().Be(expected);
    }

    [Theory]
    [InlineData("#EXECUTE shit", "'#EXECUTE'")]
    [InlineData("#Execute shit", "'#Execute'")]
    [InlineData("shit #END-EXECUTE", "'#END-EXECUTE'")]
    [InlineData("shit #End-Execute", "'#End-Execute'")]
    public void ShouldThrow_IfInvalidSyntax(string action, string expected)
        => new Action(() => Target.SelectRegion(action, "Foo", SupportedRegions))
            .Should().Throw()
            .Which.Message.Should().ContainAll(expected, "#EXECUTE REGION-NAME dsl-statements #END-EXECUTE");
}
