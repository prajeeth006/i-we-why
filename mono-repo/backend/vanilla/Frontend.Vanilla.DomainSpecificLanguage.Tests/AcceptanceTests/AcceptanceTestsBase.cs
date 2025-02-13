using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.DomainSpecificLanguage.Providers;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Microsoft.Extensions.DependencyInjection;
using Moq;
using Newtonsoft.Json;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.AcceptanceTests;

public abstract class AcceptanceTestsBase
{
    protected IDslCompiler Compiler { get; private set; }
    protected IDslSyntaxValidator SyntaxValidator { get; private set; }
    protected IPlaceholderCompiler PlaceholderCompiler { get; private set; }
    protected Mock<IUserDslProvider> UserDslProvider { get; private set; }
    protected Mock<IAppDslProvider> AppDslProvider { get; private set; }
    protected Mock<ICookiesDslProvider> CookiesDslProvider { get; private set; }
    protected JsonConverter JsonConverter { get; private set; }

    public AcceptanceTestsBase()
    {
        UserDslProvider = new Mock<IUserDslProvider>();
        CookiesDslProvider = new Mock<ICookiesDslProvider>();
        AppDslProvider = new Mock<IAppDslProvider>();

        var services = new ServiceCollection()
            .AddVanillaDomainSpecificLanguage()
            .AddFakeVanillaDslProviders()
            .AddSingleton(UserDslProvider.Object)
            .AddSingleton(CookiesDslProvider.Object)
            .AddSingleton(AppDslProvider.Object)
            .BuildServiceProvider();

        Compiler = services.GetRequiredService<IDslCompiler>();
        PlaceholderCompiler = services.GetRequiredService<IPlaceholderCompiler>();
        SyntaxValidator = services.GetRequiredService<IDslSyntaxValidator>();
        JsonConverter = services.GetRequiredService<ConfigurationInstanceJsonConverter>().Converter;
    }
}
