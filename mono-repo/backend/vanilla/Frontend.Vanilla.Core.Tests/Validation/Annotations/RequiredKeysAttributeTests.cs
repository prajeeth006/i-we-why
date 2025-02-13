using System;
using System.Collections.Generic;
using System.Linq;
using FluentAssertions;
using Frontend.Vanilla.Core.Validation.Annotations;
using Frontend.Vanilla.Core.Validation.Annotations.Abstract;
using Frontend.Vanilla.Testing.FluentAssertions;
using Frontend.Vanilla.Testing.Xunit;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Validation.Annotations;

public class RequiredKeysAttributeTests
{
    private static readonly ValidationAttributeBase Target = new RequiredKeysAttribute();

    [Theory]
    [InlineData(false)]
    [InlineData(true)]
    public void ShouldNotAllowWhiteSpaceKeys(bool useObjectKeys)
        => RunTest(
            useObjectKeys,
            new Dictionary<string, object>
            {
                { "key1", new object() },
                { "", "empty" },
                { "  ", new object() },
                { "key2", "valid" },
            },
            expectedInvalidReason:
            $"can't contain empty nor white-space keys but there are items with such keys: {{{Environment.NewLine}    '': 'empty',{Environment.NewLine}    '  ': System.Object{Environment.NewLine}}}");

    [Theory, BooleanData]
    public void ShouldPassIfNoWhiteSpaceKeys(bool useObjectKeys)
        => RunTest(
            useObjectKeys,
            new Dictionary<string, object>
            {
                { "key1", new object() },
                { "key2", "valid" },
            },
            expectedInvalidReason: null);

    private static void RunTest(bool useObjectKeys, Dictionary<string, object> dict, string expectedInvalidReason)
    {
        var obj = useObjectKeys ? (object)dict.ToDictionary(i => (object)i.Key, i => i.Value) : dict;

        var result = Target.GetInvalidReason(obj); // Act

        result.Should().Be(expectedInvalidReason);
    }

    [Fact]
    public void ShouldThrowIfUnsupportedDictionary()
    {
        var dict = new Dictionary<int, string>();

        Action act = () => Target.GetInvalidReason(dict);

        act.Should().Throw().WithMessage(
            $"It doesn't make sense to put {typeof(RequiredKeysAttribute)} on value {typeof(Dictionary<int, string>)}"
            + " because its keys are not System.String nor System.Object (they are System.Int32) and null isn't allowed for a dictionary in general.");
    }
}
