using System.Collections.Generic;
using Frontend.Vanilla.Core.System;
using Newtonsoft.Json.Linq;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.AcceptanceTests;

public static class TestChangeset
{
    public const long TestId = 2919;
    public const string TestFooValue = "BWIN";
    public const string InvalidFooValue = "  "; // It's [Required]
    public static readonly UtcDateTime TestValidFrom = new UtcDateTime(2016, 8, 17, 9, 38, 56);

    public static string GetJson(long id = TestId, string fooValue = TestFooValue, UtcDateTime? validFrom = null, long? lastCommitId = null)
        => JObject.FromObject(
            new
            {
                ChangesetId = id,
                ValidFrom = (validFrom ?? TestValidFrom).ToString(),
                LastCommitId = lastCommitId,
                Configuration = new
                {
                    Foo = new
                    {
                        Value = new
                        {
                            DataType = "string",
                            Values = new[] { new { Value = fooValue, Context = new object(), Priority = 0 } },
                        },
                        DslExpression = new
                        {
                            DataType = "string",
                            Values = new[] { new { Value = "User.LoggedIn", Context = new object(), Priority = 0 } },
                        },
                    },
                    Bar = new
                    {
                        BusinessValue = new
                        {
                            DataType = "int",
                            Values = new[] { new { Value = 123, Context = new object(), Priority = 0 } },
                        },
                        IsEnabled = new
                        {
                            DataType = "bool",
                            Values = new[] { new { Value = true, Context = new object(), Priority = 0 } },
                        },
                        Person = new
                        {
                            DataType = "json",
                            Values = new object[]
                            {
                                new { Value = new { FirstName = "Homer", LastName = "Simpson" }, Context = new object(), Priority = 0 },
                                new { Value = new { FirstName = "Bart" }, Context = new { Religion = "Evil" }, Priority = 1 },
                                new { Value = new { FirstName = "Lisa" }, Context = new { Religion = "Buddhism" }, Priority = 1 },
                            },
                        },
                    },
                },
            }).ToString();

    public static readonly string VariationHierarchy = JObject.FromObject(
        new
        {
            Hierarchy = new Dictionary<string, Dictionary<string, string>>
            {
                ["Religion"] = new Dictionary<string, string>
                {
                    { "Christianity", null },
                    { "Evil", null },
                    { "Satanism", "Evil" },
                    { "Peaceful", null },
                    { "Buddhism", "Peaceful" },
                },
                ["Environment"] = new Dictionary<string, string>
                {
                    { "qa666", null },
                },
            },
        }).ToString();
}
