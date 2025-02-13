using System;
using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon.LocalOverrides;
using Frontend.Vanilla.Testing.FluentAssertions;
using Newtonsoft.Json.Linq;
using Xunit;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.LocalOverrides;

public sealed class OverridesJsonMergerTests
{
    private static readonly IOverridesJsonMerger Target = new OverridesJsonMerger();

    public static readonly IEnumerable<object[]> TestCases = new[]
    {
        Create(
            input: @"{
                    item0: 'original-0',
                    item1: 'original-1',
                    nested: {
                        item2: 'original-2',
                        item3: 'original-3'
                    }
                }",
            toMerge: @"{
                    item1: 'merged-1',
                    item4: 'merged-4',
                    nested: {
                        item2: 'merged-2',
                        item5: { item6: 'merged-5' }
                    }
                }",
            expected: @"{
                    item0: 'original-0',
                    item1: 'merged-1',
                    item4: 'merged-4',
                    nested: {
                        item2: 'merged-2',
                        item3: 'original-3',
                        item5: { item6: 'merged-5' }
                    }
                }"),

        Create(
            input: "{ valUE: 123 }",
            toMerge: "{ Value: 456 }",
            expected: "{ Value: 456 }"),

        Create(
            input: "{ items: [ 1, 2, 3 ] }",
            toMerge: "{ items: [ 4, 5, 6 ] }",
            expected: "{ items: [ 4, 5, 6 ] }"),

        Create(
            input: "{ item: 'Hello' }",
            toMerge: "{ item: null }",
            expected: "{ item: null }"),

        Create(
            input: "{ item1: 'a', item2: 'b' }",
            toMerge: "{ item1: undefined }",
            expected: "{ item2: 'b' }"),

        Create(
            input: @"{ Configuration: { FooFeature: { Bar: {
                    DataType: 'string',
                    Values: [
                        {
                            Value: { Company: 'Party' },
                            Priority: 0,
                            Context: { label: 'partypoker.com' }
                        },
                        {
                            Value: { Company: 'BWIN', Location: 'Vienna' },
                            Priority: 1,
                            Context: { label: 'bwin.com' }
                        }
                    ]
                }}}}",
            toMerge: /* Different letter-casing */ @"{ configuratioN: { fooFeaturE: { Bar: {
                    valueS: [
                        {
                            valuE: { Company: 'GVC' },
                            ValidFrom: 2016,
                            contexT: { LABEL: 'BWIN.com' }
                        }
                    ]
                }}}}",
            expected: @"{ Configuration: { FooFeature: { Bar: {
                    DataType: 'string',
                    Values: [
                        {
                            Value: { Company: 'Party' },
                            Priority: 0,
                            Context: { label: 'partypoker.com' }
                        },
                        {
                            Value: { Company: 'GVC', Location: 'Vienna' },
                            Priority: 1,
                            ValidFrom: 2016,
                            Context: { label: 'bwin.com' }
                        }
                    ]
                }}}}"),

        Create(
            input: @"{ Configuration: { FooFeature: { Bar: {
                    DataType: 'int',
                    Values: [
                        { Value: 111, Context: { label: 'partypoker.com' } }
                    ]
                }}}}",
            toMerge: @"{ Configuration: { FooFeature: { Bar: {
                    Values: [
                        { Value: 222, Context: { label: 'bwin.com' } }
                    ]
                }}}}",
            expected: @"{ Configuration: { FooFeature: { Bar: {
                    DataType: 'int',
                    Values: [
                        { Value: 111, Context: { label: 'partypoker.com' } },
                        { Value: 222, Context: { label: 'bwin.com' } }
                    ]
                }}}}"),

        Create(
            input: @"{ Configuration: {
                    FooFeature: {
                        ExistingKey: {
                            DataType: 'int',
                            Values: [ { Value: 111, Context: {} } ]
                        }
                    }
                }}",
            toMerge: @"{ Configuration: {
                    FooFeature: {
                        NewKey: {
                            Values: [ { Value: 222, Context: {} } ]
                        }
                    },
                    BarFeature: {
                        BarKey: {
                            Values: [ { Value: 333, Context: {} } ]
                        }
                    }
                }}",
            expected: @"{ Configuration: {
                    FooFeature: {
                        ExistingKey: {
                            DataType: 'int',
                            Values: [ { Value: 111, Context: {} } ]
                        },
                        NewKey: {
                            DataType: 'dummy',
                            Values: [ { Value: 222, Context: {} } ]
                        }
                    },
                    BarFeature: {
                        BarKey: {
                            DataType: 'dummy',
                            Values: [ { Value: 333, Context: {} } ]
                        }
                    }
                }}"),

        CreateWithMergedContext(""),
        CreateWithMergedContext("Context: null"),
        CreateWithMergedContext("Context: {}"),
    };

    private static object[] CreateWithMergedContext(string mergedContext) => Create(
        input: @"{ Configuration: { FooFeature: { Bar: {
                DataType: 'int',
                Values: [
                    { Value: 111, Context: {} }
                ]
            }}}}",
        toMerge: @"{ Configuration: { FooFeature: { Bar: {
                Values: [
                    { Value: 222, " + mergedContext + @" }
                ]
            }}}}",
        expected: @"{ Configuration: { FooFeature: { Bar: {
                DataType: 'int',
                Values: [
                    { Value: 222, Context: {} }
                ]
            }}}}");

    public static IEnumerable<object[]> JsonTestCases()
    {
        yield return new object[]
        {
            $"{{{Environment.NewLine}  \"label\": \"bwin.com\"{Environment.NewLine}}}",
            "{ label: 'bwin.com' }",
        };
        // Add more test cases here
    }

    private static object[] Create(string input, string toMerge, string expected)
        => new object[] { input, toMerge, expected };

    [Theory, MemberData(nameof(TestCases))]
    public void ShouldMergeJson(string input, string toMerge, string expected)
    {
        var thisJson = JObject.Parse(input);
        var jsonToMerge = JObject.Parse(toMerge);

        // Act
        Target.Merge(thisJson, jsonToMerge);

        thisJson.Should().BeJson(expected);
        jsonToMerge.Should().BeJson(JObject.Parse(toMerge)); // Should not be modified
    }

    [Theory]
    [InlineData("{}", "null")]
    [MemberData(nameof(JsonTestCases))]
    public void ShouldThrowIfMultipleValuesWithSameContext(string context1, string context2)
    {
        var input = JObject.Parse(
            @"{ Configuration: { FooFeature: { Bar: {
                Values: [ { Value: 111, Context: {} } ]
            }}}}");
        var toMerge = JObject.Parse(
            @"{ Configuration: { FooFeature: { Bar: {
                Values: [
                    { Value: 222, Context: " + context1 + @" },
                    { Value: 222, Context: " + context2 + @" },
                ]
            }}}}");

        var act = () => Target.Merge(input, toMerge);

        act.Should().Throw().WithMessage("Failed merging local file overrides into respond from DynaCon at JSON level")
            .WithInnerMessage("There are multiple values at path 'Configuration.FooFeature.Bar.Values' with context: " + context1);
    }
}
