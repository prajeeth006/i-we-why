using System;
using Frontend.Vanilla.Core.Validation.Annotations;

namespace Frontend.Vanilla.Features.Inactive;

internal interface IInactiveConfiguration
{
    bool ShowToast { get; }
    TimeSpan ToastTimeout { get; }
    TimeSpan LogoutTimeout { get; }
    TimeSpan ActivityInterval { get; }
}

internal sealed class InactiveConfiguration : IInactiveConfiguration
{
    public const string FeatureName = "VanillaFramework.Web.UI.Inactive";

    public bool ShowToast { get; set; }

    [MinimumTimeSpan("00:00:01")]
    public TimeSpan ToastTimeout { get; set; }

    [MinimumTimeSpan("00:00:01")]
    public TimeSpan LogoutTimeout { get; set; }

    [MinimumTimeSpan("00:00:01")]
    public TimeSpan ActivityInterval { get; set; }
}
