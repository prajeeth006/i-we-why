using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Frontend.Vanilla.Core.Validation.Annotations;

namespace Frontend.Vanilla.Features.BarcodeScanner;

internal interface IBarcodeScannerIntegrationConfiguration
{
    [Required, RequiredKeys]
    IDictionary<string, string> ConditionalEvents { get; }
}

internal class BarcodeScannerIntegrationConfiguration(IDictionary<string, string> conditionalEvents) : IBarcodeScannerIntegrationConfiguration
{
    public const string FeatureName = "VanillaFramework.Features.BarcodeScannerIntegration";

    public IDictionary<string, string> ConditionalEvents { get; } = conditionalEvents;
}
