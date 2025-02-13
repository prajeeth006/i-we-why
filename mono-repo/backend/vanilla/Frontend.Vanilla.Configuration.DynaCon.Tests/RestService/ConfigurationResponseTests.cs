using System;
using Bwin.DynaCon.Api.Contracts.V1;
using FluentAssertions;
using Frontend.Vanilla.Testing.FluentAssertions;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Xunit;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.RestService;

public sealed class ConfigurationResponseTests
{
    [Fact]
    public void ShouldDeserializeModel()
    {
        const string json = @"{
                ""ValidFrom"": ""2016-02-17T10:13:33.000Z"",
                ""ChangeSetId"": 14,
                ""Configuration"": {
                    ""Feature1"": {
                        ""Text"": {
                            ""DataType"": ""string"",
                            ""Values"": [
                                { ""Value"": ""/Vanilla/bwin.com"", ""Priority"": 6 },
                                { ""Value"": ""/Help/bwin.es"", ""Priority"": 8 }
                            ]
                        },
                        ""Complex"": {
                            ""DataType"": ""json"",
                            ""Values"": [
                                { ""Value"": { ""Foo"": 123 }, ""Priority"": 9 }
                            ]
                        },
                    },
                    ""Feature2"": {
                        ""Number"": {
                            ""DataType"": ""int"",
                            ""Values"": [
                                { ""Value"": 3, ""Priority"": 0 }
                            ]
                        },
                        ""Flag"": {
                            ""DataType"": ""bool"",
                            ""Values"": [
                                { ""Value"": true, ""Priority"": 0 }
                            ]
                        }
                    }
                }
            }";

        // Act
        var dto = JsonConvert.DeserializeObject<ConfigurationResponse>(json);

        dto.ChangesetId.Should().Be(14);
        dto.ValidFrom.Should().Be(new DateTime(2016, 2, 17, 10, 13, 33));
        dto.Configuration.Keys.Should().Equal("Feature1", "Feature2");
        dto.Configuration["Feature1"].Keys.Should().Equal("Text", "Complex");
        dto.Configuration["Feature1"]["Text"].DataType.Should().Be("string");
        dto.Configuration["Feature1"]["Text"].Values.Count.Should().Be(2);
        dto.Configuration["Feature1"]["Text"].Values[0].Value.Should().Be("/Vanilla/bwin.com");
        dto.Configuration["Feature1"]["Text"].Values[0].Priority.Should().Be(6);
        dto.Configuration["Feature1"]["Text"].Values[1].Value.Should().Be("/Help/bwin.es");
        dto.Configuration["Feature1"]["Text"].Values[1].Priority.Should().Be(8);
        dto.Configuration["Feature1"]["Complex"].DataType.Should().Be("json");
        dto.Configuration["Feature1"]["Complex"].Values.Count.Should().Be(1);
        dto.Configuration["Feature1"]["Complex"].Values[0].Value.Should().BeJson(JObject.FromObject(new { Foo = 123 }));
        dto.Configuration["Feature1"]["Complex"].Values[0].Priority.Should().Be(9);
        dto.Configuration["Feature2"].Keys.Should().Equal("Number", "Flag");
        dto.Configuration["Feature2"]["Number"].DataType.Should().Be("int");
        dto.Configuration["Feature2"]["Number"].Values.Count.Should().Be(1);
        dto.Configuration["Feature2"]["Number"].Values[0].Value.Should().Be(3L);
        dto.Configuration["Feature2"]["Number"].Values[0].Priority.Should().Be(0);
        dto.Configuration["Feature2"]["Flag"].DataType.Should().Be("bool");
        dto.Configuration["Feature2"]["Flag"].Values.Count.Should().Be(1);
        dto.Configuration["Feature2"]["Flag"].Values[0].Value.Should().Be(true);
        dto.Configuration["Feature2"]["Flag"].Values[0].Priority.Should().Be(0);
    }
}
