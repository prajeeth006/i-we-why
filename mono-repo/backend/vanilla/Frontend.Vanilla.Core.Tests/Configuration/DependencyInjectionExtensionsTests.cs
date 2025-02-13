using System;
using FluentAssertions;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.Patterns;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Testing.Moq;
using Microsoft.Extensions.DependencyInjection;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Configuration;

public sealed class DependencyInjectionExtensionsTests
{
    private ServiceCollection services;
    private Mock<IConfigurationEngine> engine;
    private IServiceProvider provider;
    private const string TestFeature = "VanillaFramework.Foo.Bar";

    public DependencyInjectionExtensionsTests()
    {
        engine = new Mock<IConfigurationEngine>();
        services = new ServiceCollection();
        services.AddSingleton(engine.Object);
    }

    public interface IFooConfiguration { }

    public class FooConfiguration : IFooConfiguration { }

    public class FooDto { }

    [Fact]
    public void ShouldRegisterConfigurationUsingGenerics()
    {
        services.AddConfiguration<IFooConfiguration, FooConfiguration>(TestFeature); // Act
        VerifyRegisteredConfig(serviceType: typeof(IFooConfiguration),
            implType: typeof(FooConfiguration),
            factoryType: typeof(PassThroughConfigurationFactory<IFooConfiguration, FooConfiguration>));

        // Factory method should call dummy factory
        var config = new FooConfiguration();
        var result = provider.GetRequiredService<IConfigurationInfo>().CreateUsingFactory(config);

        result.Value.Should().BeSameAs(config);
        result.Warnings.Should().BeEmpty();
    }

    public class FooFactory : IConfigurationFactory<IFooConfiguration, FooDto>
    {
        public static WithWarnings<IFooConfiguration> ResultToReturn { get; set; }
        public static FooDto ReceivedDto { get; set; }

        public WithWarnings<IFooConfiguration> Create(FooDto dto)
        {
            ReceivedDto = dto;

            return ResultToReturn;
        }
    }

    [Fact]
    public void ShouldRegisterConfigurationWithFactory()
    {
        services.AddConfigurationWithFactory<IFooConfiguration, FooDto, FooFactory>(TestFeature); // Act
        VerifyRegisteredConfig(serviceType: typeof(IFooConfiguration),
            implType: typeof(FooDto),
            factoryType: typeof(FooFactory));

        // Factory method should call underlying factory
        FooFactory.ResultToReturn = Mock.Of<IFooConfiguration>().WithWarnings("Wtf");
        FooFactory.ReceivedDto = null;

        var dto = new FooDto();
        var result = provider.GetRequiredService<IConfigurationInfo>().CreateUsingFactory(dto);
        result.Value.Should().BeSameAs(FooFactory.ResultToReturn.Value);
        result.Warnings.Should().Equal("Wtf");
        FooFactory.ReceivedDto.Should().BeSameAs(dto);
    }

    public class FooBuilder : IConfigurationBuilder<IFooConfiguration>
    {
        public IFooConfiguration Build() => null;
    }

    [Fact]
    public void ShouldRegisterConfigurationWithBuilder()
    {
        services.AddConfigurationWithBuilder<IFooConfiguration, FooBuilder>(TestFeature); // Act
        VerifyRegisteredConfig(serviceType: typeof(IFooConfiguration),
            implType: typeof(FooBuilder),
            factoryType: typeof(ConfigurationBuilderFactory<IFooConfiguration, FooBuilder>));
    }

    public enum FailTestCase
    {
        /// <summary>
        /// Default
        /// </summary>
        Default,

        /// <summary>
        /// With Factory Registration
        /// </summary>
        WithFactoryRegistration,

        /// <summary>
        /// With Builder
        /// </summary>
        WithBuilder,
    }

    [Theory]
    [InlineData(FailTestCase.Default)]
    [InlineData(FailTestCase.WithBuilder)]
    [InlineData(FailTestCase.WithFactoryRegistration)]
    public void ShouldFailFast_IfInvalidFeatureName(FailTestCase testCase)
    {
        var act = GetAct<FooConfiguration, FooBuilder>(testCase, null);
        act.Should().Throw<ArgumentException>().Which.ParamName.Should().Be("featureName");
    }

    [Theory]
    [InlineData(FailTestCase.Default)]
    [InlineData(FailTestCase.WithBuilder)]
    [InlineData(FailTestCase.WithFactoryRegistration)]
    public void ShouldFailFast_IfInvalidImplementationType(FailTestCase testCase)
    {
        var act = GetAct<IFooConfiguration, IConfigurationBuilder<IFooConfiguration>>(testCase, "Foo");
        act.Should().Throw<ArgumentException>().Which.ParamName.Should().Be("TDto");
    }

    private Action GetAct<TImplementation, TBuilder>(FailTestCase testCase, TrimmedRequiredString featureName)
        where TImplementation : class, IFooConfiguration
        where TBuilder : class, IConfigurationBuilder<IFooConfiguration>
    {
        switch (testCase)
        {
            case FailTestCase.WithFactoryRegistration:
                return () =>
                    services
                        .AddConfigurationWithFactory<IFooConfiguration, TImplementation,
                            IConfigurationFactory<IFooConfiguration, TImplementation>>(featureName);
            case FailTestCase.WithBuilder:
                return () => services.AddConfigurationWithBuilder<IFooConfiguration, TBuilder>(featureName);
            default:
                return () => services.AddConfiguration<IFooConfiguration, TImplementation>(featureName);
        }
    }

    private void VerifyRegisteredConfig(Type serviceType, Type implType, Type factoryType)
    {
        provider = services.BuildServiceProvider();
        var testConfig = Mock.Of<IFooConfiguration>();
        engine.SetupWithAnyArgs(e => e.CreateConfiguration(null)).Returns(testConfig);

        // Act
        var info = provider.GetRequiredService<IConfigurationInfo>();
        var config = provider.GetRequiredService<IFooConfiguration>();

        config.Should().BeSameAs(testConfig);
        info.ServiceType.Should().Be(serviceType);
        info.ImplementationType.Should().Be(implType);
        info.FeatureName.Should().Be(TestFeature);
        info.FactoryType.Should().Be(factoryType);
        engine.Verify(e => e.CreateConfiguration(info));
        provider.GetRequiredService<IConfigurationInfo>().Should().BeSameAs(info, "should be singleton");
        provider.GetRequiredService<IFooConfiguration>().Should().BeSameAs(config, "should be singleton");
    }
}
