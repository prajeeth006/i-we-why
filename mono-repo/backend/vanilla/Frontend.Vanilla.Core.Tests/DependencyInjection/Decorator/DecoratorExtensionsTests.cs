using System.Linq;
using FluentAssertions;
using Frontend.Vanilla.Core.DependencyInjection;
using Frontend.Vanilla.Core.DependencyInjection.Decorator;
using Microsoft.Extensions.DependencyInjection;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.DependencyInjection.Decorator;

public sealed class DecoratorExtensionsTests
{
    private IServiceCollection services;
    private ServiceDependency serviceDependency;

    public DecoratorExtensionsTests()
    {
        serviceDependency = new ServiceDependency();
        services = new ServiceCollection().AddSingleton(serviceDependency);
    }

    [Theory]
    [InlineData(ServiceLifetime.Scoped)]
    [InlineData(ServiceLifetime.Singleton)]
    [InlineData(ServiceLifetime.Transient)]
    public void AddWithDecorators_ShouldDecorateService(ServiceLifetime lifetime)
    {
        var decoratorDependency = new DecoratorDependency();
        services.AddSingleton(decoratorDependency);
        services.AddSingleton("Hello");

        // Act
        services.AddWithDecorators<ITestService>(lifetime,
            p => ActivationExtensions.Create<TestService>(p),
            b => b
                .DecorateBy<TestDecorator1>()
                .DecorateBy((s, p) => new TestDecorator2(s, p.GetService<string>())));

        VerifyLifetime(lifetime);
        var decorator2 = (TestDecorator2)services.BuildServiceProvider().GetService<ITestService>();
        decorator2.Message.Should().Be("Hello");
        var decorator1 = (TestDecorator1)decorator2.Inner;
        decorator1.Dependency.Should().BeSameAs(decoratorDependency);
        var testService = (TestService)decorator1.Inner;
        testService.Dependency.Should().BeSameAs(serviceDependency);
    }

    [Fact]
    public void AddSingletonWithDecorators_ShouldRegisterCorrectly()
    {
        // Act
        services.AddSingletonWithDecorators<ITestService, TestService>(b => { });

        VerifyLifetime(ServiceLifetime.Singleton);
        services.BuildServiceProvider().GetService<ITestService>().Should().BeOfType<TestService>();
    }

    private void VerifyLifetime(ServiceLifetime lifetime)
        => services.Single(s => s.ServiceType == typeof(ITestService)).Lifetime.Should().Be(lifetime);

    public interface ITestService { }

    public class ServiceDependency { }

    public class TestService : ITestService
    {
        public ServiceDependency Dependency { get; }
        public TestService(ServiceDependency dependency) => Dependency = dependency;
    }

    public class DecoratorDependency { }

    public class TestDecorator1 : ITestService
    {
        public ITestService Inner { get; }
        public DecoratorDependency Dependency { get; }

        public TestDecorator1(ITestService inner, DecoratorDependency dependency)
        {
            Inner = inner;
            Dependency = dependency;
        }
    }

    public class TestDecorator2 : ITestService
    {
        public ITestService Inner { get; }
        public string Message { get; }

        public TestDecorator2(ITestService inner, string message)
        {
            Inner = inner;
            Message = message;
        }
    }
}
