using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.Diagnostics.Health;
using Frontend.Vanilla.Core.Reflection.Facade;
using Frontend.Vanilla.Features.ClientConfig;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.ReCaptcha;

internal static class ReCaptchaServices
{
    public static void AddReCaptchaFeatureBase(this IServiceCollection services)
    {
        services.AddConfigurationWithFactory<IReCaptchaConfiguration, ReCaptchaConfigurationDto, ReCaptchaConfigurationFactory>(ReCaptchaConfiguration.FeatureName);
        services.AddFacadeFor<IReCaptchaService>();
        services.AddSingleton<IVerificationService, VerificationService>();
        services.AddSingleton<IVerificationEvaluationService, VerificationEvaluationService>();
        services.AddSingleton<IFailureCounter, FailureCounter>();
        services.AddSingleton<IEnablementService, EnablementService>();
        services.AddSingleton<IAssessmentService, AssessmentService>();
        services.AddSingleton<IVerificationMessageProvider, VerificationMessageProvider>();
        services.AddSingleton<IHealthCheck, ReCaptchaEnterpriseHealthCheck>();
    }

    public static void AddReCaptchaFeatureSfapi(this IServiceCollection services)
    {
        services.AddSingleton<IClientConfigProvider, ReCaptchaClientConfigProvider>();
    }
}
