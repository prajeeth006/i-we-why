using System;
using System.Collections.Generic;
using Bwin.DynaCon.Api.Contracts.V1;
using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon.LocalOverrides;
using Frontend.Vanilla.Configuration.DynaCon.Tests.Fakes;
using Frontend.Vanilla.Testing.FluentAssertions;
using Frontend.Vanilla.Testing.Moq;
using Moq;
using Newtonsoft.Json.Linq;
using Xunit;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.LocalOverrides;

public class OverridesValidationOverriderTests
{
    private IChangesetOverrider target;
    private Mock<IChangesetOverrider> inner;

    private IValidChangeset changeset;

    public OverridesValidationOverriderTests()
    {
        inner = new Mock<IChangesetOverrider>();
        target = new OverridesValidationOverrider(inner.Object);

        var dto = TestConfigDto.Create(
            id: 66,
            configs: new Dictionary<string, IReadOnlyDictionary<string, KeyConfiguration>>
            {
                ["VanillaFoo"] = new Dictionary<string, KeyConfiguration>
                {
                    { "Name", TestConfigDto.CreateKey() },
                    { "Level", TestConfigDto.CreateKey() },
                },
                ["SportsBar"] = new Dictionary<string, KeyConfiguration>
                {
                    { "Title", TestConfigDto.CreateKey() },
                },
            });
        changeset = Mock.Of<IValidChangeset>(c => c.Dto == dto);
    }

    [Theory]
    [InlineData("{}")]
    [InlineData("{ Configuration: {} }")]
    [InlineData("{ cONFiguration: { VanillaFoo: { Level: 123 } } }")]
    public void ShouldPass(string overridesStr)
    {
        var overrides = JObject.Parse(overridesStr);

        // Act
        target.Override(changeset, overrides);

        inner.Verify(i => i.Override(changeset, overrides));
    }

    [Theory]
    [InlineData("{ Confguration: 'Invalid root property, maybe typo', Other: 123 }",
        "Overrides JSON don't contain Configuration root property but instead: 'Confguration', 'Other'.")]
    [InlineData("{ Configuration: { VanillaFoo: {}, vanillaFoo: {} } }",
        "Overrides contain a feature specified multiple times: 'VanillaFoo', 'vanillaFoo'.")]
    [InlineData("{ Configuration: { VanillaFoo: { Name: 11, name: 22 } } }",
        "Overrides contain a feature 'VanillaFoo' with a key specified multiple times: 'Name', 'name'.")]
    [InlineData("{ Configuration: { VanillaWtf: { Name: 11 } } }",
        "Active changeset 66 doesn't contain Feature 'VanillaWtf' so it can't be overridden. Existing Features: 'VanillaFoo', 'SportsBar'.")]
    [InlineData("{ Configuration: { vanillaFoo: { Wtf: 11 } } }",
        "Feature 'vanillaFoo' of active changeset 66 doesn't contain Key 'Wtf' so it can't be overridden. Existing Keys of the Feature: 'Name', 'Level'.")]
    public void ShouldThrow(string overridesStr, string expectedError)
    {
        var overrides = JObject.Parse(overridesStr);

        Action act = () => target.Override(changeset, overrides);

        act.Should().Throw().Which.Message.Should().Be(expectedError);
        inner.VerifyWithAnyArgs(i => i.Override(null, null), Times.Never);
    }
}
