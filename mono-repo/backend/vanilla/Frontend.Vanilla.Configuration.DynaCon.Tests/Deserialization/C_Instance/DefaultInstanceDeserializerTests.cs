using System;
using System.Linq;
using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon.Deserialization.C_Instance;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.Patterns;
using Frontend.Vanilla.Testing.Moq;
using Moq;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Linq;
using Xunit;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.Deserialization.C_Instance;

public sealed class DefaultInstanceDeserializerTests
{
    private IInstanceDeserializer target;
    private Mock<IConfigurationInfo> info;

    public DefaultInstanceDeserializerTests()
    {
        target = new DefaultInstanceDeserializer(new[] { new ConfigurationInstanceJsonConverter(new StringEnumConverter()) });
        info = new Mock<IConfigurationInfo>();

        info.SetupWithAnyArgs(i => i.CreateUsingFactory(null))
            .Returns<object>(c => c.WithWarnings("Warn A", "Warn B"));
    }

    public class TestConfig
    {
        public int Number { get; set; }
        public string Text { get; set; }
    }

    [Fact]
    public void ShouldDeserializeConfig()
    {
        var config = RunTest<TestConfig>(
            @"{
                Number: 123,
                Text: 'bwin'
            }");

        config.Number.Should().Be(123);
        config.Text.Should().Be("bwin");
    }

    public class DefaultValueConfig
    {
        public string Text { get; set; } = "gibberish";
    }

    [Fact]
    public void ShouldDeserializeNullValueOverwritingDefault()
    {
        var config = RunTest<DefaultValueConfig>("{ Text: null }");
        config.Text.Should().BeNull();
    }

    public class ComplexConfig
    {
        public Person Person { get; set; }
    }

    public class Person
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
    }

    [Fact]
    public void ShouldDeserializeComplexObject()
    {
        var config = RunTest<ComplexConfig>(
            @"{
                Person: {
                    FirstName: 'Chuck',
                    LastName: 'Norris'
                }
            }");

        config.Person.FirstName.Should().Be("Chuck");
        config.Person.LastName.Should().Be("Norris");
    }

    public class EnumConfig
    {
        public DayOfWeek Day { get; set; }
    }

    [Fact]
    public void ShouldUseCustomConverters()
    {
        var config = RunTest<EnumConfig>("{ Day: 'Friday' }");
        config.Day.Should().Be(DayOfWeek.Friday);
    }

    public class MissingArgConfig
    {
        public MissingArgConfig(string text)
        {
            if (text == null)
                throw new ArgumentNullException(nameof(text), "Constructor error");
        }
    }

    [Fact]
    public void ShouldWrap_IfArgumentException_FromJsonDeserialization()
        => RunInvalidConfigurationTest<MissingArgConfig>(expectedErrorMsg: "Constructor error", expectedMemberName: "text");

    [Fact]
    public void ShouldWrap_IfArgumentException_FromJsonFactory()
    {
        info.SetupWithAnyArgs(i => i.CreateUsingFactory(null)).Throws(new ArgumentException("Factory error", "testProp"));
        RunInvalidConfigurationTest<TestConfig>(expectedErrorMsg: "Factory error", expectedMemberName: "testProp");
    }

    private void RunInvalidConfigurationTest<T>(string expectedErrorMsg, string expectedMemberName)
    {
        var jsonObj = JObject.Parse("{}");
        info.SetupGet(i => i.ImplementationType).Returns(typeof(T));

        Action act = () => target.Deserialize(info.Object, jsonObj);

        var error = act.Should().Throw<InvalidConfigurationException>()
            .Which.Errors.Single();
        error.ErrorMessage.Should().StartWith(expectedErrorMsg);
        error.MemberNames.Should().Equal(expectedMemberName);
    }

    private T RunTest<T>(string json)
    {
        var jsonObj = JObject.Parse(json);
        info.SetupGet(i => i.ImplementationType).Returns(typeof(T));

        // Act
        var (config, warnings) = target.Deserialize(info.Object, jsonObj);

        info.Verify(i => i.CreateUsingFactory(config));
        warnings.Should().Equal("Warn A", "Warn B");

        return config.Should().BeAssignableTo<T>().Which;
    }
}
