using System;
using System.Collections.Generic;
using System.Linq;
using FluentAssertions;
using Frontend.Vanilla.Core.Validation.Annotations;
using Frontend.Vanilla.Core.Validation.Annotations.Abstract;
using Frontend.Vanilla.Testing.FluentAssertions;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Validation.Annotations;

public class RequiredValuesAttributeTests
{
    private static readonly ValidationAttributeBase Target = new RequiredValuesAttribute();

    [Theory]
    [InlineData(false)]
    [InlineData(true)]
    public void ShouldNotAllowWhiteSpaceValues(bool useObjectValues)
        => RunTest(
            useObjectValues,
            new Dictionary<string, string>
            {
                { "key1", "valid" },
                { "null-key", null },
                { "empty-key", "" },
                { "white-space-key", "  " },
                { "key2", "valid2" },
            },
            expectedInvalidReason: $"can't contain null values nor white-space strings but there are items with such values:"
                                   + $" {{{Environment.NewLine}    'null-key': null,{Environment.NewLine}    'empty-key': '',{Environment.NewLine}    'white-space-key': '  '{Environment.NewLine}}}");

    [Fact]
    public void ShouldNotAllowNulls_IfNotStringValues()
        => RunTest(
            false,
            new Dictionary<string, int?>
            {
                { "key1", 111 },
                { "null-key", null },
            },
            expectedInvalidReason: $"can't contain null values but there are items with such values: {{{Environment.NewLine}    'null-key': null{Environment.NewLine}}}");

    [Theory]
    [InlineData(false)]
    [InlineData(true)]
    public void ShouldPassIfNoWhiteSpaceValues(bool useObjectKeys)
        => RunTest(
            useObjectKeys,
            new Dictionary<string, string>
            {
                { "key1", "valid" },
                { "key2", "valid" },
            },
            expectedInvalidReason: null);

    private static void RunTest<TValue>(bool useObjectValues, Dictionary<string, TValue> dict, string expectedInvalidReason)
    {
        var obj = useObjectValues ? (object)dict.ToDictionary(i => i.Key, i => (object)i.Value) : dict;

        var result = Target.GetInvalidReason(obj); // Act

        result.Should().Be(expectedInvalidReason);
    }

    [Fact]
    public void ShouldThrowIfUnsupportedDictionary()
    {
        var dict = new Dictionary<string, int>();

        Action act = () => Target.GetInvalidReason(dict);

        act.Should().Throw().WithMessage(
            $"It doesn't make sense to put {typeof(RequiredValuesAttribute)} on {typeof(Dictionary<string, int>)}"
            + " because its values are of type System.Int32 which can't be null.");
    }
}
