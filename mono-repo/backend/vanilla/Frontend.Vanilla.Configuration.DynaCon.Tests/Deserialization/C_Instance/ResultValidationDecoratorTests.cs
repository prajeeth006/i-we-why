using System;
using System.ComponentModel.DataAnnotations;
using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon.Deserialization.C_Instance;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.Patterns;
using Frontend.Vanilla.Core.Validation;
using Moq;
using Newtonsoft.Json.Linq;
using Xunit;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.Deserialization.C_Instance;

public sealed class ResultValidationDecoratorTests
{
    private IInstanceDeserializer target;
    private Mock<IInstanceDeserializer> inner;
    private IConfigurationInfo configInfo;
    private JObject json;

    public ResultValidationDecoratorTests()
    {
        inner = new Mock<IInstanceDeserializer>();
        target = new ResultValidationDecorator(inner.Object);
        configInfo = Mock.Of<IConfigurationInfo>();
        json = new JObject();
    }

    private void RunAndExpectToPass(object config)
    {
        var innerResult = config.WithWarnings("Warn A", "Warn B");
        inner.Setup(i => i.Deserialize(configInfo, json)).Returns(innerResult);

        // Act
        var result = target.Deserialize(configInfo, json);

        result.Should().BeSameAs(innerResult);
    }

    private void RunAndExpectErrors(object config, params ValidationResult[] expectedErrors)
    {
        inner.Setup(i => i.Deserialize(configInfo, json)).Returns(config);

        // Act
        Action act = () => target.Deserialize(configInfo, json);

        act.Should().Throw<InvalidConfigurationException>()
            .And.Errors.Should().Equal(expectedErrors, new ValidationResultComparer().Equals);
    }

    public class TestConfig
    {
        [Required]
        public string Value { get; set; }

        [Range(0, 10)]
        public int Number { get; set; }
    }

    [Fact]
    public void ShouldPassIfValidConfig()
        => RunAndExpectToPass(new TestConfig { Value = "bwin" });

    [Fact]
    public void ShouldFailIfInvalidConfig()
        => RunAndExpectErrors(
            new TestConfig(),
            new ValidationResult("The Value field is required.", new[] { nameof(TestConfig.Value) }));

    [Fact]
    public void ShouldCollectAllErrors()
        => RunAndExpectErrors(
            new TestConfig { Number = 666 },
            new ValidationResult("The Value field is required.", new[] { nameof(TestConfig.Value) }),
            new ValidationResult("The field Number must be between 0 and 10.", new[] { nameof(TestConfig.Number) }));

    public class DisableableTestConfig : IDisableableConfiguration
    {
        public bool IsEnabled { get; set; }

        [Required]
        public string Value { get; set; }
    }

    [Fact]
    public void ShouldPassIfValidEnabledConfig()
        => RunAndExpectToPass(new DisableableTestConfig { IsEnabled = false, Value = "bwin" });

    [Fact]
    public void ShouldFailIfInvalidEnabledConfig()
        => RunAndExpectErrors(
            new DisableableTestConfig { IsEnabled = true, Value = null },
            new ValidationResult("The Value field is required.", new[] { nameof(TestConfig.Value) }));

    [Fact]
    public void ShouldPassIfInvalidDisabledConfig()
        => RunAndExpectToPass(new DisableableTestConfig { IsEnabled = false, Value = null });
}
