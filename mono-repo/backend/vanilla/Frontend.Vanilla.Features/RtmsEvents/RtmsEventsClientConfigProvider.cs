using System.Linq;
using Frontend.Vanilla.Features.ClientConfig;

namespace Frontend.Vanilla.Features.RtmsEvents;

internal sealed class RtmsEventsClientConfigProvider(IRtmsEventsConfiguration rtmsConfiguration) : LambdaClientConfigProvider("vnRtmsEvents", () => new
{
    rtmsConfiguration.IsCashierRedirectEnabled,
    rtmsEventToToastr = rtmsConfiguration.RtmsEventToToastr?.ToDictionary(c => c.Key.ToLower(), c => c.Value),
})
{
    public override ClientConfigType Type => ClientConfigType.Lazy;
}
