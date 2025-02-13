using Frontend.Vanilla.Features.ClientConfig;

namespace Frontend.Vanilla.Features.Validation;

internal sealed class ValidationClientConfigProvider(IValidationConfiguration validationConfiguration) : LambdaClientConfigProvider("vnValidation",
    () => new
    {
        validationConfiguration.ErrorMapping,
        validationConfiguration.Rules,
        validationConfiguration.RegexList,
    }) { }
