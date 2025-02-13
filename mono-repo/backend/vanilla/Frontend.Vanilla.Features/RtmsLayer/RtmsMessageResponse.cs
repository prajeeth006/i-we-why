using System.Collections.Generic;

namespace Frontend.Vanilla.Features.RtmsLayer;

internal sealed class RtmsMessageResponse(IEnumerable<RtmsMessageViewModel> messages)
{
    public IEnumerable<RtmsMessageViewModel> Messages { get; set; } = messages;
}
