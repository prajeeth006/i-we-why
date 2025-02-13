using System.ComponentModel.DataAnnotations;

namespace Frontend.Host.Features.StatusCode;

internal interface IStatusCodeConfiguration
{
    public IDictionary<string, IReadOnlyList<string>> ResponseStatusCode { get; }
}

internal sealed class StatusCodeConfiguration(IDictionary<string, IReadOnlyList<string>> responseStatusCode) : IStatusCodeConfiguration, IValidatableObject
{
    public const string FeatureName = "VanillaFramework.Features.StatusCode";

    public IDictionary<string, IReadOnlyList<string>> ResponseStatusCode { get; } = responseStatusCode;

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (ResponseStatusCode.Values.Count != ResponseStatusCode.Values.Distinct().Count())
            yield return new ValidationResult($"Same path exists in different status codes, Please remove duplicate path.");
    }
}
